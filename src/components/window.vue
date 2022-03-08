
<template>
  <!-- 统一定义window样式 预留两个插槽给子类实现 ，将来是否处理actionWindowId？-->
  <div :id="item.id" :data-id="item.id" :class="[{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
    } ,className]" class="window-item window-item-resize " @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <!-- 插槽3 扩展 -->
    <slot name="extend"></slot>
    <div @click="wact.setWindowPos(item.id)" v-if="item.windowType=='web'" :class="{ action:  item.actionWindow }" class="window-mask"></div>
    <div class="window-content">
      <div class="window-title base-title">
        <!-- 插槽1 -->
        <slot name="header"></slot>
        <div class="opt">
          <i v-if="item.canMin" class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i v-if="item.canMax" class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div class="window-body">
        <!-- 插槽2 -->
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
const props = defineProps({
  className: String,
  item: Object,
  actionWindowId: String,
  title: String
});

</script>

<style>
</style>