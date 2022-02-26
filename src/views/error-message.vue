<template>
  <div :data-id="item.id" :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      'error-message': item.windowType == 'error-message',
    }" class="window-item" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <div @click="wact.setWindowPos(item.id)" :class="{ action: actionWindowId == item.id }" class="window-mask"></div>
    <div class="window-content">
      <div class="window-title">
        <header></header>
        <div class="opt">
          <i class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div class="window-body">
        {{ state.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});
let state = reactive({ ...props.item.data });
</script>

<style>
</style>