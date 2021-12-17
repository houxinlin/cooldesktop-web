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
    @mousedown="windowMove"
    @mouseup="windowMouseUp"
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

const windowMove = (e) => {
  if (e.which == 3) {
    return;
  }
  for (const item of windowManager.state.windowsCollection) {
    item.pointerEvents = true;
  }
  let odiv = e.target;
  let downDiv = odiv;
  let list = [];

  //找到window-item节点
  while (list.findIndex((item) => item == "window-item") == -1) {
    odiv = odiv.parentNode;
    let classList = odiv.classList;
    if (classList == undefined) {
      return;
    }
    list = [...classList];
  }
  //   state.actionWindowId = odiv.getAttribute("data-id");
  //   setWindowPos(state.actionWindowId);
  //置顶
  odiv.style.zIndex = 9999;
  for (const item of document.querySelectorAll(".window-item")) {
    if (item != odiv) {
      item.style.zIndex = 1000;
    }
  }

  //除了window-body其他都可以移动
  if (
    [...downDiv.classList].findIndex((item) => item == "window-title") == -1
  ) {
    if (downDiv.nodeName != "HEADER") {
      return;
    }
  }
  let disX = e.clientX - odiv.offsetLeft;
  let disY = e.clientY - odiv.offsetTop;
  document.onmousemove = (e) => {
    let left = e.clientX - disX;
    let top = e.clientY - disY;

    // state.positionX = top;
    // state.positionY = left;

    odiv.style.left = left + "px";
    odiv.style.top = top + "px";
  };
  document.onmouseup = (e) => {
    document.onmousemove = null;
    document.onmouseup = null;
    console.log(windowManager.state)
    for (const item of windowManager.state.windowsCollection) {
      item.pointerEvents = false;
    }
  };
};
</script>

<style>
</style>