<template>
  <div class="desktop">
    <div class="work-region">
      <div class="app-list">
        <ul>
          <li @dblclick="openNewFolder">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">文件</div>
            </div>
          </li>

        </ul>
      </div>
      <template v-for="item in folder" :key="item">
        <div
          :class="{
            'window-transition': item.windowTransition,
            'min-window': item.minState,
            'max-window': item.maxState,
          }"
          class="window-item"
        >
          <div class="window-title" @mousedown="windowMove">
            <header>文件夹</header>
            <div class="opt">
              <i
                class="iconfont icon-tzuixiaohua"
                @click="windowMin(item.id)"
              ></i>
              <i class="iconfont icon-big" @click="windowSize(item.id)"></i>
              <i
                class="iconfont icon-webicon309"
                @click="closeWindow(item.id)"
              ></i>
            </div>
          </div>
          <div class="window-body">
            {{ item.id }}
          </div>
        </div>
      </template>
      <template v-for="item in appWindows" :key="item">
        <div
          :class="{
            'window-transition': item.windowTransition,
            'min-window': item.minState,
            'max-window': item.maxState,
          }"
          class="window-item"
        >
          <div class="window-title" @mousedown="windowMove">
            <header>{{ item.title }}</header>
            <div class="opt">
              <i
                class="iconfont icon-tzuixiaohua"
                @click="windowMin(item.id)"
              ></i>
              <i class="iconfont icon-big" @click="windowSize(item.id)"></i>
              <i
                class="iconfont icon-webicon309"
                @click="closeWindow(item.id)"
              ></i>
            </div>
          </div>
          <div class="window-body">
            <iframe :src="item.url"></iframe>
          </div>
        </div>
      </template>
    </div>
    <div class="task-bar">
      <div class="task-bar-mask"></div>
      <div class="task-bar-content">
        <ul>
          <template v-for="item in taskBarInfo" :key="item">
            <li @click="showWindow(item.id)">
              <div class="task-item">
                <img :src="item.icon" alt="" />
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import "../assets/font/iconfont.css";
import { randId } from "../utils/utils";
export default {
  setup() {
    let state = reactive({
      positionX: 0,
      positionY: 0,
      folder: [],
      appWindows: [],
      taskBarInfo: [],
      actionWindowId: -1,
    });
    const windowMove = (e) => {
      let odiv = e.target;
      let list = [];
      while (list.findIndex((item) => item == "window-item") != 0) {
        odiv = odiv.parentNode;
        let classList = odiv.classList;
        list = [...classList];
      }
      odiv.style.zIndex = 9999;
      for (const item of document.querySelectorAll(".window-item")) {
        if (item != odiv) {
          item.style.zIndex = 1000;
        }
      }

      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (e) => {
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        state.positionX = top;
        state.positionY = left;

        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = (e) => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    const pushWindow = (windowType, icon, url) => {
      let windowId = randId();
      state.actionWindowId = windowId;
      windowType.push({
        url: url,
        id: windowId,
        maxState: false,
        minState: false,
        windowTransition: false,
      });
      state.taskBarInfo.push({
        id: windowId,
        icon: icon,
      });
      return windowId;
    };
    const openNewFolder = () => {
      pushWindow(state.folder, "/src/assets/icon/ic-folder.png", "");
    };
    const closeWindow = (id) => {
      getAppById(id).tp.splice(getAppById(id).index, 1);
      state.taskBarInfo.splice(
        state.taskBarInfo.findIndex((item) => item.id == id),
        1
      );
    };
    const showWindow = (id) => {
      getAppById(id).instance.minState = !getAppById(id).instance.minState;
    };
    const windowMin = (id) => {
      getAppById(id).instance.minState = !getAppById(id).instance.minState;
    };
    const getAppById = (id) => {
      let index = state.folder.findIndex((item) => item.id == id);
      if (index >= 0) {
        return {
          instance: state.folder[index],
          index: index,
          tp: state.folder,
        };
      }
      index = state.appWindows.findIndex((item) => item.id == id);
      return {
        instance: state.appWindows[index],
        index: index,
        tp: state.appWindows,
      };
    };
    const windowSize = (id) => {
      let app = getAppById(id);
      if (app.instance.maxState) {
        app.instance.maxState = !app.instance.maxState;
        setTimeout(() => {
          app.instance.windowTransition = !app.instance.windowTransition;
        }, 500);
      } else {
        app.instance.windowTransition = !app.instance.windowTransition;
        setTimeout(() => {
          app.instance.maxState = !app.instance.maxState;
        }, 10);
      }
    };
    const openNewApp = (url) => {
      pushWindow(state.appWindows, "/src/assets/icon/ic-folder.png", url);
    };

    return {
      openNewApp,
      showWindow,
      windowMin,
      windowSize,
      closeWindow,
      openNewFolder,
      windowMove,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less">
@import "../assets/less/index.less";
@import "../assets/less/window.less";
</style>>
