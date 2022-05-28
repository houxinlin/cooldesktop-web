<template>
  <BaseWindow :item="item" className="web">
    <template v-slot:body>
      <div class="iframe">
        <!-- 菜单 -->
        <menu v-if="menuState.length != 0" class="menu">
          <li @click="menuClick(item.name )" v-for="item in menuState" :key="item.name" class="menu-item cursor-pointer">
            <!-- 一级菜单名字 -->
            <div class="first-menu">{{ item.name }}</div>
            <template v-if="item.subMenu.length!=0">
              <menu v-for="subMenu in item.subMenu" :key="subMenu" class="second-menu">
                <div @click="menuClick(item.name + '/' + subMenu)" class="second-name">
                  {{ subMenu }}
                </div>
              </menu>
            </template>

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
        <iframe class="mainFrame" id="iframe" :class="{ 'iframe-pointer-events': state.pointerEvents }" :src="state.url"></iframe>
      </div>
    </template>
    <template v-slot:header>
      <header>{{item.application.applicationName}}</header>
    </template>
  </BaseWindow>

</template>


<script setup>

import BaseWindow from "../components/window.vue";
import elementResizeDetectorMaker from "element-resize-detector";
import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});


props.item.events = function (e, d) {
  if (e == "close") {
    document.querySelector(`#${props.actionWindowId} .mainFrame`).style.display =
      "none";
  }
};

const menuClick = (menuPath) => {
  let iframe = document.querySelector(`#${props.item.id} .mainFrame`).contentWindow;
  iframe.postMessage({ "eventName": "menuEvent", "path": menuPath }, "*");
};

let state = reactive({ ...props.item.data });
let menus = state.application.menus;
let menuState = reactive([]);
let menuMap = new Map();
const initMenus = () => {
  for (let menuItem of menus) {
    if (menuItem.length == 0) { continue; }
    let menuSplit = menuItem.split("/");
    let menuSource = menuMap.get(menuSplit[0]) || [];
    if (menuSplit.length > 1) {
      menuSource.push(menuSplit[1]);
    }
    menuMap.set(menuSplit[0], menuSource);
  }
  for (let [key, value] of menuMap) {
    menuState.push({ name: key, subMenu: value });
  }

};

initMenus();
</script>

<style lang="less">
@import "../assets/less/iframe.less";
</style>