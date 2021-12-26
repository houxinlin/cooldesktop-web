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
      'file-upload-manager': item.windowType == 'upload-manager',
    }"
    class="window-item"
    @mousedown="wact.windowMove"
    @mouseup="wact.windowMouseUp"
  >
    <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div>
    <div class="window-content">
      <div class="window-title">
        <header></header>
        <div class="opt">
          <i
            class="iconfont icon-tzuixiaohua"
            @click="wact.windowMin(item.id)"
          ></i>
          <i
            class="iconfont icon-big"
            @click="wact.windowFullScreen(item.id)"
          ></i>
          <i
            class="iconfont icon-webicon309"
            @click="wact.closeWindow(item.id)"
          ></i>
        </div>
      </div>
      <div class="window-body">
        <template v-for="item in state.files" :key="item.id">
          <div class="item">
            <img class="file" src="../assets/icon/ic-shop.png" alt="" />
            <div @click="cancelFile(item.id)" class="cancel">
              <img src="../assets/icon/ic-close.png" alt="" />
            </div>
            <div class="info">
              <span class="name">{{ item.name }}</span>
              <div
                :style="{ width: item.progress + '%' }"
                class="progress"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
import { uploadQueue, cancel } from "../utils/upload/manager.js";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});

let state = reactive({ ...props.item.data });
const cancelFile = (id) => {
  cancel(id);
};
</script>

<style>
</style>