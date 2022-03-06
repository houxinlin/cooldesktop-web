<template>
  <div :id="item.id" :data-id="item.id" :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      terminal: item.windowType == 'terminal',
    }" class="window-item window-item-resize" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <!-- <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div> -->
    <div class="window-content">
      <div class="window-title base-title">
        <header>{{windowTitle}}</header>
        <div class="opt">
          <i class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div style="padding: 0px" class="window-body">
        <div id="xterm-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
props.item.events = function (e, d) {
  if (e == "close") {
    //断开连接
    terminalSocket.close()
    clearInterval(listenerWindowSizeEventTimerId)
  }
};

import elementResizeDetectorMaker from "element-resize-detector";

import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
import Stomp from "stompjs";
let stompClient = null;
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
let windowTitle = ref("连接中...")
let terminalSocket = null
let listenerWindowSizeEventTimerId = null
const fitAddon = new FitAddon();
const term = new Terminal({
  fontSize: 16,
  rightClickSelectsWord: true,
  letterSpacing: 0,
  allowTransparency: true,
  cursorBlink: true,
  cursorStyle: "bar",
  cols: 92,
  rows: 24,
  theme: {
    background: "#00000000",
  },
});
let terminalWindowSizeData = ""
//宽度自适应
term.loadAddon(fitAddon);

const PrefixInteger = (num, n) => {
  return (Array(n).join(0) + num).slice(-n);
};
onMounted(() => {
  listenerWindowSizeEventTimerId = setInterval(() => {
    if (terminalSocket != null && terminalWindowSizeData != "") {
      terminalSocket.send(terminalWindowSizeData)
      terminalWindowSizeData = ""
    }
  }, 2000);
  const erd = elementResizeDetectorMaker();
  erd.listenTo(document.getElementById(props.item.id), (element) => {
    fitAddon.fit();
    var setSizeMessage =
      "setSize" +
      PrefixInteger(term.cols, 4) +
      PrefixInteger(term.rows, 4) +
      PrefixInteger(element.offsetWidth, 4) +
      PrefixInteger(element.offsetHeight, 4);
    terminalWindowSizeData = setSizeMessage

  });

  let xterm = document.querySelector("#" + props.item.id + " #xterm-container");
  term.open(xterm);
  connectWebSocket();
});

const websocketClose = (e) => {
  term.writeln("连接已断开！。");
};
const websocketOpen = (e) => {
  windowTitle.value = "终端"
  if (props.item.data.path != null) {
    terminalSocket.send("cd " + props.item.data.path + "\r")
  }
}
const connectWebSocket = () => {
  let url = import.meta.env.VITE_APP_TERMINAL_WEBSOCKET;
  url = eval(url)
  terminalSocket = new WebSocket(url);
  const attachAddon = new AttachAddon(terminalSocket);
  term.loadAddon(attachAddon);
  terminalSocket.onclose = websocketClose
  terminalSocket.onopen = websocketOpen
};
</script>

<style>
@import url("xterm/css/xterm.css");
@import url("../assets/less/terminal.less");
</style>