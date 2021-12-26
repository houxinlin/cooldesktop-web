<template>
  <div :class="{ 'desktop-none': state.desktopScale }" class="desktop">
    <div
      class="app-starter"
      :class="{ 'app-starter-visible': state.appStarterVisible }"
    >
      <div class="app-list">
        <ul>
          <li @dblclick="coolWindow.openNewFolder()">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">文件</div>
            </div>
          </li>
          <li
            @dblclick="coolWindow.openNewApp('http://www.houxinlin.com:6060/')"
          >
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">构建</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="work-region">
      <template v-for="item in state.windowsCollection" :key="item">
        <FileUploadManagerView

          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'upload-manager'"
        />
        <FolderView
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'folder'"
        />
        <IWebView
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'web'"
        />
        <ErrorMessageView
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'error-message'"
        />
        <SuccessMessageView
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'success-message'"
        />
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
            <li @click="wact.showWindow(item.id)">
              <div class="task-item">
                <img
                  :class="{ select: item.id == state.actionWindowId }"
                  :src="item.icon"
                  alt=""
                />
                <span
                  :class="{ select: item.id == state.actionWindowId }"
                ></span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script  setup >
import FolderView from "./folder.vue";
import IWebView from "./iframe.vue";
import ErrorMessageView from "./error-message.vue";
import SuccessMessageView from "./success-dialog.vue";
import FileUploadManagerView from "./fileUpload-manager-view.vue";
import { onMounted } from "vue";
import { state, coolWindow, wact } from "../windows/window-manager.js";
import {Queue} from "../utils/queue"

import {
  changeProgress,
  removeById,
  uploads,
} from "../utils/upload/manager";


onMounted(() => {
  setTimeout(() => {
    state.desktopScale = false;
  }, 10);
});
</script>

<style lang="less">
@import "../assets/font/iconfont.css";
@import "../assets/less/index.less";
@import "../assets/less/window.less";
@import "../assets/less/folder.less";
@import "../assets/less/error-message.less";
@import "../assets/less/success-message.less";
</style>>
