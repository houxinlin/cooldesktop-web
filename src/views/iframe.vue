<template>
  <div :id="item.id" :data-id="item.id" :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      web: item.windowType == 'web',
    }" class="window-item window-item-resize" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <!-- <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div> -->
    <div class="window-content">
      <div class="window-title base-title">
        <header></header>
        <div class="opt">
          <i class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div style="padding: 0px" class="iframe window-body">
        <menu v-if="menuState.length != 0" class="menu">
          <li v-for="item in menuState" :key="item.name" class="menu-item">
            <div class="first-menu">{{ item.name }}</div>
            <menu v-for="subMenu in item.subMenu" :key="subMenu" class="second-menu">
              <div @click="menuClick(item.name + '/' + subMenu)" class="second-name">
                {{ subMenu }}
              </div>
            </menu>
          </li>
        </menu>
        <!-- <menu class="menu">
          <li class="menu-item">
            <div class="first-menu">关于</div>
            <menu class="second-menu">
              <div class="second-name">作者</div>
            </menu>
          </li>
        </menu> -->
        <iframe id="iframe" :class="{ 'iframe-pointer-events': state.pointerEvents }" :src="state.url"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});

props.item.events = function (e, d) {
  if (e == "close") {
    document.querySelector(`#${props.actionWindowId} #iframe`).style.display =
      "none";
  }
};

const menuClick = (menuPath) => {
  let iframe = document.getElementById("iframe").contentWindow;
  iframe.postMessage({ "menu-event": { action: menuPath } }, "*");
};

let state = reactive({ ...props.item.data });
let menus = state.handlerApp.menus;
let menuState = reactive([]);
let menuMap = new Map();
const initMenus = () => {
  for (const menuItem of menus) {
    let menuSplit = menuItem.split("/");
    let source = menuMap.get(menuSplit[0]) || [];
    source.push(menuSplit[1]);
    menuMap.set(menuSplit[0], source);
  }
  for (var [key, value] of menuMap) {
    menuState.push({ name: key, subMenu: value });
  }
};

initMenus();
</script>

<style>
</style>