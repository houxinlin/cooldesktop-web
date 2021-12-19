<template>
  <div
    :id="item.id"
    :data-id="item.id"
    :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      folder: item.windowType == 'folder',
    }"
    class="window-item"
    @mousedown="windowManager.windowMove"
    @mouseup="windowManager.windowMouseUp"
  >
    <div
      v-if="state.folderContextMenuVisible"
      :style="{
        left: state.folderContextMenuPoint.x + 'px',
        top: state.folderContextMenuPoint.y + 'px',
      }"
      class="file-menu"
    >
      <menu>
        <div class="item-group">
          <li>在此处打开终端</li>
        </div>
        <div class="item-group">
          <li>创建文件夹</li>
          <li>创建文件</li>
        </div>
        <div class="item-group">
          <li>粘贴</li>
        </div>
        <div class="item-group">
          <li>属性</li>
        </div>
      </menu>
    </div>
    <div
      v-if="state.contextMenuVisible"
      :style="{
        left: state.contextMenuPoint.x + 'px',
        top: state.contextMenuPoint.y + 'px',
      }"
      class="file-menu"
    >
      <menu>
        <div class="item-group">
          <li @click="openNewFolderWhitThis()">在新窗口打开</li>
        </div>
        <div class="item-group">
          <li @click="deleteFile()">删除</li>
          <li>复制</li>
          <li>属性</li>
          <li>剪切</li>
          <li>重复名</li>
        </div>
        <div class="item-group">
          <li>下载</li>
        </div>
        <div class="item-group">
          <li>压缩</li>
        </div>
      </menu>
    </div>
    <div
      @click="windowManager.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div>
    <div class="window-content">
      <div class="window-title">
        <header>
          <ul>
            <template v-for="(item, index) in state.path.pathBlock" :key="item">
              <li @click="navPathClick(index)">{{ item }}</li>
            </template>
          </ul>
        </header>
        <div class="opt">
          <i
            class="iconfont icon-tzuixiaohua"
            @click="windowManager.windowMin(item.id)"
          ></i>
          <i
            class="iconfont icon-big"
            @click="windowManager.windowFullScreen(item.id)"
          ></i>
          <i
            class="iconfont icon-webicon309"
            @click="windowManager.closeWindow(item.id)"
          ></i>
        </div>
      </div>
      <div
        @contextmenu.prevent="folderContextMenu($event)"
        @click="
          state.contextMenuVisible = false;
          state.folderContextMenuVisible = false;
        "
        class="window-body"
      >
        <ul v-if="item.windowType == 'folder'">
          <template v-for="item in state.child" :key="item">
            <li
              @contextmenu.prevent="fileContextMenu($event, item)"
              :class="{ select: state.currentSelectName == item.name }"
              @click="
                state.currentSelectName = item.name;
                state.contextMenuVisible = false;
              "
              @dblclick="fileDblClick(item)"
            >
              <div class="file-item">
                <img
                  :src="
                    request + 'desktop/api/file/getFileIcon?path=' + item.path
                  "
                  alt=""
                />
                <span>{{ item.name }}</span>
                <div class="tip">{{ item.name }}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref } from "vue";
import * as windowManager from "../js/window-manager.js";
import * as folderManager from "../js/folder-manager.js";
import * as folderApis from "../http/folder.js";
let request = ref(import.meta.env.VITE_APP_REQUEST_URL);
const props = defineProps({
  item: Object,
  actionWindowId: String,
  folderInfo: Object,
});

let state = reactive({ ...props.item.folder });
let fileRightFlag = false;
const fileContextMenu = (e, item) => {
  state.folderContextMenuVisible = false;
  state.currentSelectName = item.name;
  state.contextMenuVisible = true;
  let window = document.getElementById(props.item.id);
  state.contextMenuPoint.x = e.x - window.offsetLeft;
  state.contextMenuPoint.y = e.y - window.offsetTop;
  e.preventDefault();
  e.stopPropagation();
};
const folderContextMenu = (e) => {
  state.currentSelectName = "";
  state.folderContextMenuVisible = true;
  state.contextMenuVisible = false;
  let window = document.getElementById(props.item.id);
  state.folderContextMenuPoint.x = e.x - window.offsetLeft;
  state.folderContextMenuPoint.y = e.y - window.offsetTop;
  e.preventDefault();
};

const listDirector = (path) => {
  folderApis.apiListDirectory(path).then((res) => {
    state.child = res.data.data;
  });
};
const fileDblClick = (item) => {
  if (item.type != "directory") {
    return;
  }
  state.contextMenuVisible = false;
  state.path.append(item.name);
  listDirector(state.path.getPath());
};
const navPathClick = (index) => {
  state.path.range(index);
  state.contextMenuVisible = false;
  listDirector(state.path.getPath());
};
const getSelectFile = () => {
  let path = state.path.getPath();
  if (path != "/") {
    path = path + "/" + state.currentSelectName;
  } else {
    path = path + state.currentSelectName;
  }
  return path;
};
const openNewFolderWhitThis = () => {
  state.contextMenuVisible = false;
  windowManager.openNewFolder(getSelectFile());
};
const refresh = () => {
  listDirector(state.path.getPath());
};
const deleteFile = () => {
  state.contextMenuVisible = false;
  folderApis.apiDeleteFileOrFolder(getSelectFile()).then((res) => {
    if (res.data.data == "OK") {
      refresh();
      return;
    }
    windowManager.startNewErrorMessageDialog(res.data.data);
  });
};
onMounted(() => {
  listDirector(state.path.getPath());
});
</script>

<style>
</style>