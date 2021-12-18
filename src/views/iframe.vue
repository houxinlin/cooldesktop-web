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
        <header></header>
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
        <iframe
          :class="{ 'iframe-pointer-events': item.pointerEvents }"
          :src="item.url"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import * as windowManager from "../js/window-manager.js";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
 const windowMouseUp = (e, b) => {
  for (const item of windowManager.state.windowsCollection) {
    item.pointerEvents = false;
  }
};

</script>

<style>
</style>