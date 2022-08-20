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
      <i v-if="homeIsvisible" @click="goHome" class="cursor-pointer pos-absolute padding-10px"><svg t="1661031892076" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19246" width="23" height="23"><path d="M168.446 581.91c-65.329-0.301-104.507-14.122-104.507-87.467 0-48.027 29.622-69.892 55.518-88.996 3.905-2.877 7.616-5.615 7.938-5.906 2.581-2.357 8.208-7.871 13.667-13.209 11.269-11.025 21.763-21.289 37.438-32.951l69.604-61.46-0.006-0.006 11.534-11.068 0.236-0.236 11.594-11.086 1.414-1.416 123.947-110.278 1.422-1.18c12.977-10.869 24.017-20.795 33.077-28.938 25.264-22.711 39.911-35.896 65.227-41.552l7.386-1.651h19.628l7.362 1.651c26.846 6.02 42.595 21.222 71.646 49.29l7.736 7.46c6.068 5.839 8.924 7.991 15.448 12.913l3.913 2.957 3.774 3.305L778.669 291.94l0.13-0.145c5.085 4.466 10.991 10.289 17.182 16.37a525.914 525.914 0 0 0 7.639 7.399c2.335 2.225 5.564 5.422 8.696 8.523 3.726 3.688 7.289 7.212 11.723 10.923 4.621 3.868 5.906 4.806 7.143 5.707 6.565 4.8 12.658 9.244 20.874 17.096 4.442 4.242 9.738 9.52 15.059 14.828 9.273 9.255 18.768 18.733 27.496 25.668 3.344 2.648 4.954 3.819 6.614 5.011 26.008 18.692 57.718 41.486 57.718 91.123 0 73.167-39.187 86.947-104.503 87.24v236.494c0 16.221-3.254 31.051-8.525 44.36-5.735 14.528-14.058 27.13-23.03 37.616-8.151 9.518-21.436 20.752-36.07 28.513-13.928 7.371-30.108 12.496-47.013 12.496h-195.92V613.751h-61.009v327.411H321.785c-43.821 0-82.043-21.322-109.385-52.724-27.149-31.173-43.954-73.744-43.954-114.411V581.91z m-44.055-87.467c0 35.712 42.201 25.755 104.507 25.755v253.829c0 50.576 41.1 106.683 92.888 106.683h100.637V579.056c0-17.174 9.026-25.756 27.096-25.756h123.846c18.735 0 30.97 11.642 30.97 29.44v297.97H739.8c14.244 0 30.116-11.381 37.274-19.751 9.096-10.625 16.913-25.105 16.913-42.782V520.198c62.307 0 104.511 9.957 104.511-25.755 0-23.087-26.569-37.094-41.432-48.904-15.888-12.624-31.523-29.668-46.564-44.039-10.324-9.86-15.002-11.678-25.187-20.209-8.583-7.175-14.993-14.179-23.258-22.038-8.444-8.036-14.538-14.527-23.169-22.119L593.294 206.953c-11.186-8.487-14.358-10.567-24.779-20.59-26.316-25.304-39.284-38.814-50.819-41.403h-8.164c-14.352 3.211-30.878 23.075-72.566 57.973L313.02 313.212a8517.008 8517.008 0 0 0-23.128 22.156l-74.24 65.552c-19.61 14.393-30.299 27.155-47.641 43.016-14.574 13.335-43.62 26.962-43.62 50.507z" fill="#e6e6e6" p-id="19247"></path></svg></i>
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
    clearInterval(listenerUrlId);
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
let homeIsvisible=ref(false);
let listenerUrlId=0;
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
const goHome=()=>{
 let iframe = document.querySelector(`#${props.item.id} .mainFrame`).contentWindow;
 iframe.location.href=state.url
}


listenerUrlId= setInterval(() => {
  try {
      let iframe = document.querySelector(`#${props.item.id} .mainFrame`).contentWindow;
      let path =iframe.location.pathname+iframe.location.search
      homeIsvisible.value=path!=state.url;
  } catch (error) {
    
  }
}, 100);
initMenus();
</script>

<style lang="less">
@import "../assets/less/iframe.less";
</style>