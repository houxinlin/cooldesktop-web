<template>
  <div
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
      <div class="window-body">
        <ul v-if="item.windowType == 'folder'">
          <template v-for="item in state.child" :key="item">
            <li
              :class="{ select: state.currentSelectName == item.name }"
              @click="state.currentSelectName = item.name"
              @dblclick="fileDblClick(item)"
            >
              <div class="file-item">
                <img
                  :src="request+'desktop/api/file/getFileIcon?path=' +
                    item.path
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
import { apiListDirectory } from "../http/folder.js";
let request=ref(import.meta.env.VITE_APP_REQUEST_URL)
const props = defineProps({
  item: Object,
  actionWindowId: String,
  folderInfo: Object,
});


let state = reactive({ ...props.item.folder });

const listDirector = (path) => {
  apiListDirectory(path).then((res) => {
    state.child = res.data.data;
  });
};
const fileDblClick = (item) => {
  if (item.type != "directory") {
    return;
  }
  state.path.append(item.name);
  listDirector(state.path.getPath());
};
const navPathClick = (index) => {
  state.path.range(index);
  console.log(state.path.getPath());

  listDirector(state.path.getPath());
};
onMounted(() => {
  listDirector(state.path.getPath());
});
</script>

<style>
</style>