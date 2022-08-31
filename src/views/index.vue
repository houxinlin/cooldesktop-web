
<template>
  <div :class="{ 'desktop-none': state.desktopScale }" :style="{'background-image':defaultBackgroundImageUrl}" class="desktop">
    <div class="app-starter" :class="{ 'app-starter-visible': state.appStarterVisible }">
      <div class="app-list">
        <ul>
          <!-- 默认应用 -->
          <template v-for="item in defaultAppList" :key="item.name">
            <li v-if="item.visibilityIsDesktop" @dblclick="item.action">
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
      <!-- 状态栏 -->
      <div class="status-bar pos-absolute color-white flex">
        <div class="left"></div>
        <div class="center"></div>
        <div class="right flex flex-all-center">
          <span>{{userNameRef}}</span>
          <span>{{serverTimeRef}}</span>
          <span @click="logout"> <i> <svg t="1658147165145" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5333" width="16" height="16">
                <path d="M511.771963 1023.291077c-63.724308 0-125.558154-12.445538-183.768615-37.100308a469.464615 469.464615 0 0 1-150.134154-101.139692 471.118769 471.118769 0 0 1 59.392-717.351385 37.021538 37.021538 0 0 1 43.008 59.864616 403.692308 403.692308 0 0 0-121.304616 139.027692A391.798154 391.798154 0 0 0 113.435963 551.227077c0 106.338462 41.432615 206.375385 116.657231 281.6a395.736615 395.736615 0 0 0 281.678769 116.736c106.338462 0 206.454154-41.432615 281.757539-116.736a395.421538 395.421538 0 0 0 116.65723-281.6 391.483077 391.483077 0 0 0-45.528615-184.635077 403.298462 403.298462 0 0 0-121.304615-138.870154 36.864 36.864 0 0 1 43.008-59.943384 471.04 471.04 0 0 1 59.392 717.430153 471.04 471.04 0 0 1-333.981539 138.161231z m11.106462-512.236308a36.864 36.864 0 0 1-36.94277-36.864V37.021538a37.021538 37.021538 0 0 1 73.964308 0v437.169231c0 20.48-16.541538 36.864-37.021538 36.864z" p-id="5334" fill="#ffffff"></path>
              </svg></i></span>
        </div>
      </div>

      <!-- 桌面文件 -->
      <div class="desktop-work pos-absolute pos-ltrb0">
        <!-- 菜单 -->
        <div v-if="contentMenuState.visual" class="menu pos-absolute" :style="{ left: contentMenuState.x +'px',top: contentMenuState.y + 'px' }">
          <ul>
            <li @click="deleteDesktopFile()">删除此快捷方式</li>
            <li @click="openContainer()">打开所在目录</li>
          </ul>
        </div>
        <ul class="folder" @mousedown="contentMenuState.visual=false">
          <template v-for="item in folderState.list" :key="item.path">
            <li @contextmenu.prevent="showContextMenu($event, item)" @dblclick="startHandlerWindow(item)">
              <div class="file-item">
                <img v-if="item.type != 'image'" :src=" serverDomain + 'desktop/api/file/getFileIconByType?type=' + item.rawType" />
                <img v-if="item.type == 'image'" :src=" serverDomain +'desktop/api/file/getImageThumbnail?path=' + encodeURIComponent(item.path) " alt="" />
                <span class="file-name">{{ getLastName(item.name) }}</span>
              </div>
            </li>
          </template>
        </ul>

      </div>
      <!-- 窗口 -->
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
        <InputDialog :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'input-dialog'" />
        <Tail :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'tail'" />
        <SysLog :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'sys-log'" />
        <ShareLink :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'share-link'" />
        <ShareLinkDaySelect :actionWindowId="state.actionWindowId" :item="item" v-if="item.windowType == 'share-link-day-select'" />



      </template>
    </div>
    <!-- 任务栏 -->
    <div class="task-bar">
      <div class="task-bar-mask"></div>
      <div class="task-bar-content">
        <ul>
          <li @click="coolWindow.openStarter(); contentMenuState.visual=false">
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
import DialogCompressSelect from "./dialog/select-compress-dialog.vue";
import DialogCreateFile from "./dialog/create-file-dialog.vue";
import LoadingView from "./loading-view.vue";
import FolderView from "./folder.vue";
import IWebView from "./iframe.vue";
import ErrorMessageView from "./dialog/error-message-dialog.vue";
import SuccessMessageView from "./dialog/success-message-dialog.vue";
import Setting from "./setting.vue";
import FileUploadManagerView from "./fileUpload-manager-view.vue";
import TerminalView from "./terminal.vue";
import FileAttribute from "./file-attribute.vue";
import ApplicationView from "./application-view.vue";
import CustomApplicationView from "./custom-application.vue";
import DeveloperDoc from "./doc.vue";
import InputDialog from "./dialog/input-dialog.vue";
import Tail from "./tail-log.vue";
import SysLog from "./sys-log.vue";
import ShareLink from "./dialog/share-link-dialog.vue";

import ShareLinkDaySelect from "./dialog/share-link-day-select-dialog.vue";


import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { state, coolWindow, wact } from "../windows/window-manager.js";
import { initInstallProgressManager } from "../utils/install-progress-manager.js"
import { VueNotificationList } from "@dafcoe/vue-notification";

import "@dafcoe/vue-notification/dist/vue-notification.css";
import defaultAppList from "../application/default-applications.js"
import getSocketConnection from "../utils/socket.js";
import * as string from "../global/strings.js";
import * as systemApi from "../http/system"
import * as globalApi from "../global/api/global-api.js"
import { refreshApplication, applicationState, getApplicationByMedia } from "../global/application.js";
import { WindowActions } from "../windows/window-action";
let userNameRef = ref("");
let serverTimeRef = ref("");
//服务器事件戳
let serverTimeStamp = 0;
// 文件夹列表
let folderState = reactive({ "list": [] })
//右键菜单
let contentMenuState = reactive({ x: 0, y: 0, visual: false, selectFile: {} })

let stompClient =null;
let defaultBackgroundImageUrl = ref(`url('${new URL(`../assets/background/desktop.jpg`, import.meta.url).href}')`)
onMounted(() => {
  setTimeout(() => { state.desktopScale = false; }, 20);
  //初始化软件安装管理器
  initInstallProgressManager()
});

let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);

let { proxy } = getCurrentInstance();

const showContextMenu = (event, item) => {
  contentMenuState.visual = true;
  contentMenuState.x = event.x + 3;
  contentMenuState.y = event.y + 3;
  contentMenuState.selectFile = item;

}
const logout = () => {
  location.href = "/tomcat/api/logout";
}
//获取系统配置
const startApplication = (application) => {
 let window = coolWindow.startNewWebView(application);
 startApplicationEvent(window);
}
const startHandlerWindow = (item) => {
  //不知道文件类型
  if (item.type == "none") {
    postMessage({ action: "notification", param: { message: string.CANTHANDLE_FILE_TYPE, type: "error" } });
    return;
  }
  if (item.type == "folder") {
    coolWindow.startNewFolder(item.path);
    return;
  }
  //查找能处理这个应用的app
  let handlerApp = getApplicationByMedia(item.type)[0];
  if (handlerApp == undefined) {
    //没有找到
    postMessage({ action: "notification", param: { message: string.NOTFOUND_APPLICATION, type: "error" } });
    return;
  }
  //打开首页
  coolWindow.startNewWebView(handlerApp, `path=${item.path}`);
}
/**
 * 以下是测试区域
 */



/**
 * 测试区域结束
 */

//主程序通信,分发到订阅
const connectWebSocketServer = () => {
  stompClient = getSocketConnection("/desktop-topic/event", (response) => {
    let event = JSON.parse(response.body);
    proxy.eventBus.emit(event["subject"], event);
  }, (e) => {
    setTimeout(() => {  connectWebSocketServer(); }, 2000);
  });


}
//发送程序打开事件，通知后端对应程序
const startApplicationEvent=(e)=>{
   stompClient.send("/desktop/event",{},JSON.stringify({"eventType":"startApplication","data":e.applicationId}))
}
proxy.eventBus.on("/event/startApplication", (e) => { startApplicationEvent(e) });
//刷新应用程序列表订阅
proxy.eventBus.on("/event/refresh/application", (e) => { refreshApplication() });
//刷新壁纸
proxy.eventBus.on("/event/refresh/wallpaper", (e) => { refreshWallpaper() });
//打目录
proxy.eventBus.on("/event/open/directory", (e) => { coolWindow.startNewFolder(e.data, true) });

proxy.eventBus.on("/event/notify/message/error", (e) => { coolWindow.startNewErrorMessageDialog(e.data) });

proxy.eventBus.on("/event/notify/message/success", (e) => { coolWindow.startNewSuccessMessageDialog(e.data) });

proxy.eventBus.on("/event/refresh/folder", (e) => { refreshDesktopFile() });

//所有异步文件处理结果通知统一走这里，用来提示
proxy.eventBus.on("/event/file", (e) => {
  if (e.hasOwnProperty("result")) {
    if (e.result.code != 0) {
      coolWindow.startNewErrorMessageDialog(e.result.msg);
    }
  }
})
const refreshWallpaper = () => {
  systemApi.apiGetCoolDesktopConfigs().then((response) => {
    let wallpaper = response.data.data["wallpaper"]
    if (wallpaper != undefined && wallpaper != '') {
      wallpaper = wallpaper.substr(1);
      defaultBackgroundImageUrl.value = `url('${serverDomain.value}${wallpaper}')`;
    }
  })
}
const refreshDesktopFile = () => {
  systemApi.apiListDesktopFile(string.DESKTOP_FOLDER_KEY).then((response) => {
    folderState.list = response.data.data;
  })
}
const deleteDesktopFile = () => {
  systemApi.apiRemoveDesktopFile(contentMenuState.selectFile.path).then((response) => {

  })
  contentMenuState.visual = false;
}
const openContainer = () => {
  coolWindow.startNewFolder(contentMenuState.selectFile.parent);
  contentMenuState.visual = false;
}
const getLastName = (path) => {
  let sp = path.split("/");
  return sp[sp.length - 1];
}

const init = () => {
  refreshDesktopFile();
  refreshWallpaper();
  refreshApplication();
  connectWebSocketServer();

  let startTimer = new Date().getTime();
  systemApi.apiGetBaseInfo().then((response) => {
    let inv = new Date().getTime() - startTimer
    serverTimeStamp = response.data.data["timer"] + inv;
    userNameRef.value = response.data.data["user"];
    setInterval(() => {
      serverTimeStamp += 1000;
      let date = new Date(serverTimeStamp)
      serverTimeRef.value = date.getHours() + ":" + date.getMinutes()
    }, 1000);
  })
}
init()
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

