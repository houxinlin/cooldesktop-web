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
          <li @dblclick="openNewApp('http://www.houxinlin.com:6060/')">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">文件</div>
            </div>
          </li>
        </ul>
      </div>

      <template v-for="item in windowsHwnd" :key="item">
        <div
          :data-id="item.id"
          :class="{
            'window-scale': item.windowTransition,
            'min-window': item.minState,
            'max-window': item.maxState,
            'window-z-height': item.actionWindow,
            folder: item.windowType == 'folder',
          }"
          class="window-item"
          @mousedown="windowMove"
        >
          <div class="window-title">
            <header>
              <ul v-if="item.windowType == 'folder'" class="location">
                <li>/</li>
                <li>/root</li>
                <li>/pad</li>
              </ul>
            </header>
            <div class="opt">
              <i
                class="iconfont icon-tzuixiaohua"
                @click="windowMin(item.id)"
              ></i>
              <i
                class="iconfont icon-big"
                @click="windowFullScreen(item.id)"
              ></i>
              <i
                class="iconfont icon-webicon309"
                @click="closeWindow(item.id)"
              ></i>
            </div>
          </div>
          <div class="window-body">
            <iframe v-if="item.windowType == 'web'" :src="item.url"></iframe>
            <ul v-if="item.windowType == 'folder'">
              <template v-for="item in 10" :key="item">
                <li>
                  <div class="file-item">
                    <img src="../assets/icon/ic-folder-green.png" alt="" />
                    <span>root</span>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </template>
    </div>
    <div class="task-bar">
      <div class="task-bar-mask"></div>
      <div class="task-bar-content">
        <ul>
          <template v-for="item in windowsHwnd" :key="item">
            <li @click="showWindow(item.id)">
              <div class="task-item">
                <img
                  :class="{ select: item.id == actionWindowId }"
                  :src="item.icon"
                  alt=""
                />
                <span :class="{ select: item.id == actionWindowId }"></span>
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
import { StandardWindow, FolderWindow } from "../js/window.js";
export default {
  setup() {
    let state = reactive({
      positionX: 0,
      positionY: 0,
      actionWindowId: -1,
      //窗口集合
      windowsHwnd: [],
    });
    const windowMove = (e) => {
      if (e.which == 3) {
        return;
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
      state.actionWindowId = odiv.getAttribute("data-id");
      setWindowPos(state.actionWindowId);
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

    //打开新窗口
    const openNewWindow = (windowProperty = {}) => {
      let newProperty = {};
      Object.assign(newProperty, StandardWindow.getProperty(), windowProperty);
      newProperty.id = randId();
      newProperty.actionWindow = true;
      state.windowsHwnd.push(newProperty);
    };
    //打开文件夹
    const openNewFolder = () => {
      let p = FolderWindow.getProperty();
      p.icon = "/src/assets/icon/ic-folder.png";
      openNewWindow(p);

    };
    //打开web
    const openNewApp = (url) => {
      openNewWindow({ url: url, icon: "/src/assets/icon/ic-folder.png" });
    };
    //关闭Window
    const closeWindow = (id) => {
      state.windowsHwnd.splice(getAppById(id).index, 1);
    };
    //显示Window
    const showWindow = (id) => {
      //如果当前Window已经显示，并且是置顶，则开始动画
      if (
        getAppById(id).instance.actionWindow == true
      ) {
        getAppById(id).instance.windowTransition = true;
        setTimeout(() => {
          getAppById(id).instance.windowTransition = false;
        }, 600);
        return;
      }
      //显示Window
      setWindowPos(id);
    };
    //最小化
    const windowMin = (id) => {
      getAppById(id).instance.minState = !getAppById(id).instance.minState;
    };
    //获取实例
    const getAppById = (id) => {
      let index = state.windowsHwnd.findIndex((item) => item.id == id);
      return {
        instance: state.windowsHwnd[index],
        index: index,
      };
    };
    //全屏
    const windowFullScreen = (id) => {
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

    //置顶制定Id的Window
    const setWindowPos = (id) => {
      for (const item of state.windowsHwnd) {
        item.actionWindow = false;
      }

      //当前活动id
      state.actionWindowId = id;
      //设置当前为置顶
      getAppById(id).instance.actionWindow = true;
      //如果是最小化的时候，则显示
      if (getAppById(id).instance.minState) {
        getAppById(id).instance.minState = false;
        return;
      }
    };
    return {
      openNewApp,
      setWindowPos,
      showWindow,
      windowMin,
      windowFullScreen,
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
@import "../assets/less/folder.less";
</style>>
