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
          <li @dblclick="coolWindow.openFileUploadManager()">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">上传管理器</div>
            </div>
          </li>
            <li @dblclick="coolWindow.startNewTerminal('/')">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">Terminal</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="work-region">
      <template v-for="item in state.windowsCollection" :key="item">
        <DialogCreateFile
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'dialog-create-file'"
        />
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
        <DialogSelect
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'dialog-select'"
        />
        <FileAttribute
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'file-attribute'"
        />
        <TerminalView
          :actionWindowId="state.actionWindowId"
          :item="item"
          v-if="item.windowType == 'terminal'"
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
import DialogSelect from "./dialog/select-compress.vue";
import DialogCreateFile from "./dialog/create-file.vue";

import FolderView from "./folder.vue";
import IWebView from "./iframe.vue";
import ErrorMessageView from "./error-message.vue";
import SuccessMessageView from "./success-dialog.vue";
import FileUploadManagerView from "./fileUpload-manager-view.vue";
import TerminalView from "./terminal.vue";
import FileAttribute from "./file-attribute.vue";
import { onMounted } from "vue";
import { state, coolWindow, wact } from "../windows/window-manager.js";
import { Queue } from "../utils/queue";




import {
  addProgress,
  changeProgress,
  createProgress,
  removeById,
  uploads,
  uploadQueue,
} from "../utils/upload/manager";

// uploadQueue.files.enqueue({ uploadId: "a" });
// uploadQueue.files.enqueue({ uploadId: "a" });
// uploadQueue.files.dequeue();

// uploadQueue.files.dequeue();
// let result = -1;
// result = uploadQueue.files.findIndex((res) => {
//   console.log(res);
//   return res!=undefined && res.uploadId == "a";
// });

// while (result >= 0) {
//   console.log(result);
//   uploadQueue.files.splice(result, 1);
//   result = uploadQueue.files.findIndex((res) => res.uploadId == "a");
// }

// coolWindow.openFileUploadManager();
// coolWindow.openNewFolder("/home/HouXinLin");
coolWindow.startNewTerminal("/home")
// coolWindow.startNewDialogCreateFile(function(){})
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
@import "../assets/less/dialog.less";
</style>>
