<template>
  <div :class="{ 'desktop-none': desktopScale }" class="desktop">
    <div
      class="app-starter"
      :class="{ 'app-starter-visible': appStarterVisible }"
    >
      <div class="app-list">
        <ul>
          <li @dblclick="openNewFolder()">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">文件</div>
            </div>
          </li>
          <li @dblclick="openNewFolder()">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-shop.png" alt="" />
              </div>
              <div class="app-name">软件商店</div>
            </div>
          </li>
          <li @dblclick="openSetting()">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-setting.png" alt="" />
              </div>
              <div class="app-name">设置</div>
            </div>
          </li>
          <li @dblclick="openNewApp('http://www.houxinlin.com:5993/')">
            <div class="app-item">
              <div class="app-icon">
                <img src="../assets/icon/ic-folder.png" alt="" />
              </div>
              <div class="app-name">构建</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="work-region">
      <template v-for="item in windowsHwnd" :key="item">
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
            @click="setWindowPos(item.id)"
            :class="{ action: actionWindowId == item.id }"
            class="window-mask"
          ></div>
          <div class="window-content">
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
              <iframe
                :class="{ 'iframe-pointer-events': item.pointerEvents }"
                v-if="item.windowType == 'web'"
                :src="item.url"
              ></iframe>
              <ul v-if="item.windowType == 'folder'">
                <template v-for="item in 10" :key="item">
                  <li @dblclick="fileDblClick">
                    <div class="file-item">
                      <img src="../assets/icon/ic-folder-green.png" alt="" />
                      <span>root</span>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="task-bar">
      <div class="task-bar-mask"></div>
      <div class="task-bar-content">
        <ul>
          <li @click="openStarter()">
            <div class="task-item">
              <img src="../assets/icon/ic-app.png" />
            </div>
          </li>
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
  mounted() {
    setTimeout(() => {
      this.desktopScale = false;
    }, 10);
  },
  setup() {
    let state = reactive({
      desktopScale: true,
      positionX: 0,
      positionY: 0,
      actionWindowId: -1,
      //窗口集合
      windowsHwnd: [],
      appStarterVisible: false,

      windowVisibleState: [],
    });
    const hideAllWindow = (status) => {
      if (status) {
        for (const iterator of state.windowsHwnd) {
          iterator.hideWindow = false;
        }
        return;
      }
      state.windowVisibleState = state.windowsHwnd.filter(
        (item) => item.hideWindow == false
      );
      for (const iterator of state.windowsHwnd) {
        iterator.hideWindow = true;
      }
    };
    const windowMove = (e) => {
      if (e.which == 3) {
        return;
      }
      for (const item of state.windowsHwnd) {
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
      hideAllWindow(true);
      let newProperty = {};
      Object.assign(newProperty, StandardWindow.getProperty(), windowProperty);
      newProperty.id = randId();
      newProperty.actionWindow = true;
      state.actionWindowId = newProperty.id;
      state.windowsHwnd.push(newProperty);
      state.appStarterVisible = false;
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
      getAppById(id).instance.closeWindowTransition = true;
      setTimeout(() => {
        state.windowsHwnd.splice(getAppById(id).index, 1);
        state.actionWindowId = -1;
      }, 200);
    };
    //显示Window
    const showWindow = (id) => {
      if (state.appStarterVisible) {
        state.appStarterVisible = false;
        return;
      }
      //如果当前Window已经显示，并且是置顶，则开始动画
      if (getAppById(id).instance.actionWindow == true) {
        getAppById(id).instance.windowScale = true;

        setTimeout(() => {
          getAppById(id).instance.windowScale = false;
        }, 301);
        return;
      }
      if (getAppById(id).instance.minState) {
        getAppById(id).instance.minState = false;
      }
      //显示Window
      setWindowPos(id);
    };
    //最小化
    const windowMin = (id) => {
      getAppById(id).instance.minState = !getAppById(id).instance.minState;
      getAppById(id).instance.actionWindow = false;
      state.actionWindowId = -1;
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
      for (const item of state.windowsHwnd) {
        item.pointerEvents = true;
      }
      let app = getAppById(id);
      if (app.instance.maxState) {
        app.instance.maxState = !app.instance.maxState;
        setTimeout(() => {
          app.instance.windowTransition = !app.instance.windowTransition;
          for (const item of state.windowsHwnd) {
            item.pointerEvents = false;
          }
        }, 500);
      } else {
        app.instance.windowTransition = !app.instance.windowTransition;
        setTimeout(() => {
          app.instance.maxState = !app.instance.maxState;
          for (const item of state.windowsHwnd) {
            item.pointerEvents = false;
          }
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
    const windowMouseUp = (e, b) => {
      for (const item of state.windowsHwnd) {
        item.pointerEvents = false;
      }
    };
    const openStarter = () => {
      hideAllWindow(false);
      if (state.appStarterVisible) {
        hideAllWindow(true);
      }
      state.appStarterVisible = !state.appStarterVisible;
    };
    const fileDblClick = () => {};
    return {
      openStarter,
      windowMouseUp,
      fileDblClick,
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
