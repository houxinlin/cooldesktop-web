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
          <template v-for="item in applicationState.applications" :key="item.applicationId">
            <li v-if="item.visibilityIsDesktop" @dblclick="coolWindow.startNewTerminal('/')">
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
    <div class="work-region">
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
        <SoftwareView :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'software'" />
        <Setting :test="a" :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'setting'" />
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
import SoftwareView from "./software-view.vue";

import { onMounted, reactive, ref, toRef, toRefs, getCurrentInstance } from "vue";
import { state, coolWindow, wact } from "../windows/window-manager.js";
import { Queue } from "../utils/queue";
import { initInstallProgressManager } from "../utils/install-progress-manager.js"
import { VueNotificationList } from "@dafcoe/vue-notification";
import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();
import "@dafcoe/vue-notification/dist/vue-notification.css";

import { apiListApplication } from "../http/application.js";
import defaultAppList from "../software/default-software.js"
import { refreshApplication, applicationState } from "../global/application.js";
import getSocketConnection from "../utils/socket.js";
import * as systemApi from "../http/system"

let defaultBackgroundImageUrl = ref(`url('${new URL(`../assets/background/desktop.jpg`, import.meta.url).href}')`)
onMounted(() => {
  setTimeout(() => {
    state.desktopScale = false;
  }, 10);
  initInstallProgressManager()
  exportApi();
});

let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);

let { proxy } = getCurrentInstance();
//获取系统配置


/**
 * 以下是测试区域
 */
// coolWindow.startSoftware()
// coolWindow.startNewSuccessMessageDialog("asd")
coolWindow.openNewFolder("/home/HouXinLin");
/**
 * 测试区域结束
 */
//主程序通信
getSocketConnection("/topic/events", (response) => {
  let event = JSON.parse(response.body)
  console.log(event)
  proxy.eventBus.emit(event["subject"], event)

}, (e) => { });
//刷新应用程序列表
proxy.eventBus.on("/event/refresh/application", (e) => {
  refreshApplication()
})
proxy.eventBus.on("/event/refresh/wallpaper", (e) => {
  refreshWallpaper()
})
proxy.eventBus.on("/event/open/directory", (e) => {
  coolWindow.openNewFolder(e.data)
})
const exportApi = () => {
  window.addEventListener("message", (events) => {
    if (events.data.action == "notification") {
      notification(events.data.param);
      return;
    }
  });
};
const refreshWallpaper = () => {
  systemApi.apiGetSystemProperty().then((response) => {
    let wallpaper = response.data.data["wallpaper"]
    if (wallpaper != '') {
      console.log(wallpaper)
      wallpaper = wallpaper.substr(1)
      let id = Math.round(Math.random() * 100)
      defaultBackgroundImageUrl.value = `url('${serverDomain.value}${wallpaper}?id=${id}')`
    }
  })

}
refreshWallpaper()
refreshApplication()
const notification = (param) => {
  setNotification(param);
};


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
