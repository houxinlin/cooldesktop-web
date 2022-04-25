
<template>
  <div :class="{ 'desktop-none': state.desktopScale }" :style="{'background-image':defaultBackgroundImageUrl}" class="desktop">
    <div class="app-starter" :class="{ 'app-starter-visible': state.appStarterVisible }">
      <div class="app-list">
        <ul>
          <template v-for="item in defaultAppList" :key="item.name">
            <li @dblclick="item.action">
              <div class="app-item">
                <div class="app-icon">
                  <img :src="item.icon" alt="" />
                </div>
                <div class="app-name">{{ item.name }}</div>
              </div>
            </li>
          </template>
          <!-- 所有应用 -->
          <template v-for="item in applicationState.applications" :key="item.applicationId">
            <li v-if="item.visibilityIsDesktop" @dblclick="startApplication(item)">
              <div class="app-item">
                <div class="app-icon">
                  <img :src=" serverDomain + 'desktop/webapplication/' + item.applicationId + '/logo.png'" alt="" />
                </div>
                <div class="app-name">{{ item.applicationName }}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="work-region" :class="{'work-region-low-z-index':state.appStarterVisible }">
      <template v-for="item in state.windowsCollection" :key="item">
        <DialogCreateFile :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'dialog-create-file'" />
        <FileUploadManagerView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'upload-manager'" />
        <FolderView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'folder'" />
        <IWebView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'web'" />
        <ErrorMessageView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'error-message'" />
        <SuccessMessageView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'success-message'" />
        <DialogCompressSelect :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'dialog-compress-select'" />
        <FileAttribute :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'file-attribute'" />
        <TerminalView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'terminal'" />
        <LoadingView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'loading-view'" />
        <ApplicationView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'software'" />
        <Setting :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'setting'" />
        <CustomApplicationView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'custom-application'" />
        <DeveloperDoc :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'developer-doc'" />

      </template>
    </div>
    <div class="task-bar">
      <div class="task-bar-mask"></div>
      <div class="task-bar-content">
        <ul>
          <li @click="coolWindow.openStarter()">
            <div class="task-item">
              <img src="../assets/icon/ic-app.png" />
            </div>
          </li>
          <template v-for="item in state.windowsCollection" :key="item">
            <li v-if="item.showWindowInTaskBar" @click="wact.showWindow(item.id)">
              <div class="task-item">
                <img :class="{ select: item.id == state.actionWindowId }" :src="item.icon" alt="" />
                <span :class="{ select: item.id == state.actionWindowId }"></span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <vue-notification-list position="top-right"></vue-notification-list>
  </div>
</template>

<script  setup >
import DialogCompressSelect from "./dialog/select-compress.vue";
import DialogCreateFile from "./dialog/create-file.vue";
import LoadingView from "./loading-view.vue";
import FolderView from "./folder.vue";
import IWebView from "./iframe.vue";
import ErrorMessageView from "./dialog/error-message.vue";
import SuccessMessageView from "./dialog/success-dialog.vue";
import Setting from "./setting.vue";
import FileUploadManagerView from "./fileUpload-manager-view.vue";
import TerminalView from "./terminal.vue";
import FileAttribute from "./file-attribute.vue";
import ApplicationView from "./application-view.vue";
import CustomApplicationView from "./custom-application.vue";
import DeveloperDoc from "./doc.vue";
import { onMounted, reactive, ref, toRef, toRefs, getCurrentInstance } from "vue";
import { state, coolWindow, wact } from "../windows/window-manager.js";
import { initInstallProgressManager } from "../utils/install-progress-manager.js"
import { VueNotificationList } from "@dafcoe/vue-notification";

import "@dafcoe/vue-notification/dist/vue-notification.css";
import defaultAppList from "../software/default-software.js"
import getSocketConnection from "../utils/socket.js";
import * as systemApi from "../http/system"
import * as globalApi from "../global/api/global-api.js"
import { refreshApplication, applicationState } from "../global/application.js";
import { WindowActions } from "../windows/window-action";

let defaultBackgroundImageUrl = ref(`url('${new URL(`../assets/background/desktop.jpg`, import.meta.url).href}')`)
onMounted(() => {
  setTimeout(() => {
    state.desktopScale = false;
  }, 10);
  //初始化软件安装管理器
  initInstallProgressManager()
});

let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);

let { proxy } = getCurrentInstance();
//获取系统配置
const startApplication = (application) => {
  coolWindow.startNewWebView(application)
}

/**
 * 以下是测试区域
 */


/**
 * 测试区域结束
 */
//主程序通信,分发subject到订阅这上
getSocketConnection("/topic/events", (response) => {
  let event = JSON.parse(response.body)
  proxy.eventBus.emit(event["subject"], event)
}, (e) => { });
//刷新应用程序列表订阅
proxy.eventBus.on("/event/refresh/application", (e) => { refreshApplication() })
//刷新壁纸
proxy.eventBus.on("/event/refresh/wallpaper", (e) => { refreshWallpaper() })
//打目录
proxy.eventBus.on("/event/open/directory", (e) => { coolWindow.startNewFolder(e.data) })

proxy.eventBus.on("/event/notify/message/error", (e) => { coolWindow.startNewErrorMessageDialog(e.data) })
proxy.eventBus.on("/event/notify/message/success", (e) => { coolWindow.startNewSuccessMessageDialog(e.data) })
//所有异步文件处理结果通知统一走这里，用来提示
proxy.eventBus.on("/event/file", (e) => {
  if (e.hasOwnProperty("result")) {
    if (e.result.code != 0) {
      coolWindow.startNewErrorMessageDialog(e.result.msg)
    }
  }
})
const refreshWallpaper = () => {
  systemApi.apiGetSystemProperty().then((response) => {
    let wallpaper = response.data.data["wallpaper"]
    if (wallpaper != undefined && wallpaper != '') {
      wallpaper = wallpaper.substr(1)
      defaultBackgroundImageUrl.value = `url('${serverDomain.value}${wallpaper}')`
    }
  })

}
refreshWallpaper()
refreshApplication()

</script>

<style lang="less">
@import "../assets/font/iconfont.css";
@import "../assets/less/index.less";
@import "../assets/less/window.less";
@import "../assets/less/folder.less";
@import "../assets/less/error-message.less";
@import "../assets/less/success-message.less";
@import "../assets/less/loading.less";
</style>>

