
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
      'window-item-resize':item.canResize,
    } ,className,backgroundClass]" :style="[{'left':(first?windowLeft:'error')},{'top':(first?windowTop:'error')},{'width':windowWidth+'px','height':windowHeight+'px','background':backgroundFilter(item.application )}]"
    class="window-item" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <!-- 插槽3 扩展 -->
    <slot name="extend"></slot>
    <div @click="wact.setWindowPos(item.id)" v-if="item.windowType=='web'" :class="{ action:  item.actionWindow }" class="window-mask"></div>
    <div class="window-content">
      <div class="window-title base-title">
        <!-- 插槽1 -->
        <slot name="header"></slot>
        <div class="opt">
          <i v-if="item.canMin" class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i v-if="item.canMax" class="iconfont icon-big" @click="windowFullScreen(item.id)"></i>
          <i v-if="item.canClose" class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
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
import { defineProps, onMounted, ref } from "vue";
import elementResizeDetectorMaker from "element-resize-detector";
import { wact } from "../windows/window-manager.js";
import { height16, low16 } from "../utils/utils.js";
let windowWidth = ref(0);
let windowHeight = ref(0);
let windowLeft = ref(0);
let windowTop = ref(0);
let first = ref(true)
let restoreWindowsSizeTimeStamp = 0;
const props = defineProps({
  className: String,
  item: Object,
  actionWindowId: String,
  title: String,
  backgroundClass: String
});
const getWindowsSize = (type) => {
  const defaultWidth = "666";
  const defaultHeight = "422";
  if (!props.item.hasOwnProperty("application")) {
    if (type == 1) return defaultWidth;
    if (type == 2) return defaultHeight;
  };
  if (props.item.application.windowSize == 0 && type == 1) return defaultWidth;
  if (props.item.application.windowSize == 0 && type == 2) return defaultHeight;
  if (type == 1) return height16(props.item.application.windowSize);
  if (type == 2) return low16(props.item.application.windowSize);
}
const backgroundFilter = (value) => {
  let back = (value || {}).windowBackground || "#000000c4";
  return back;
}
const windowFullScreen = (id) => {
  if (props.item.maxState) restoreWindowsSizeTimeStamp = new Date().getTime();
  wact.windowFullScreen(id)
}
onMounted(() => {
  let localSize = localStorage.getItem(props.item.applicationId);
  windowWidth.value = localSize != null ? JSON.parse(localSize).width : getWindowsSize(1);
  windowHeight.value = localSize != null ? JSON.parse(localSize).height : getWindowsSize(2);

  windowLeft.value = `calc(50% - ${windowWidth.value / 2}px)`
  windowTop.value = `calc(50% - ${windowHeight.value / 2}px)`
  setTimeout(() => { first.value = false }, 10);

  const erd = elementResizeDetectorMaker();
  //监听窗口大小改变,并将自己目前的宽度保存，下一次启动时候恢复
  erd.listenTo(document.getElementById(props.item.id), (element) => {
    if (!element.classList.contains("max-window") && (new Date().getTime() - restoreWindowsSizeTimeStamp) > 500) {
      localStorage.setItem(props.item.applicationId, JSON.stringify({ width: element.offsetWidth, height: element.offsetHeight, left: element.offsetLeft, top: element.offsetTop }));
      windowWidth.value = element.offsetWidth;
      windowHeight.value = element.offsetHeight;
    }
    pushSizeChangeEvent(element.offsetWidth, element.offsetHeight);
  });
})
const pushSizeChangeEvent = (width, height) => {
  if (props.item.windowType == "web") {
    let iframe = document.querySelector(`#${props.item.id} .mainFrame`).contentWindow;
    iframe.postMessage({ "eventName": "windowEvent", "detailName": "sizeChange", "data": { width, height } }, "*");
  }
  wact.postWindowEvents(props.item.id, "sizeChange", { height, width });

};

</script>

<style>
</style>