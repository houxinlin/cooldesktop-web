<template>
  <BaseWindow :item="item" className="web">
    <template v-slot:body>
      <div class="iframe">
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
    </template>
    <template v-slot:header>
      <header></header>
    </template>
  </BaseWindow>

</template>


<script setup>

import BaseWindow from "../components/window.vue";

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
let menus = state.application.menus;
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

<style lang="less">
@import "../assets/less/iframe.less";
</style>