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
        <header>终端</header>
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
import elementResizeDetectorMaker from "element-resize-detector";

import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
import Stomp from "stompjs";
let stompClient = null;
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

props.item.events = function (e, d) {
  if (e == "close") {
    stompClient.disconnect();
  }
};
const fitAddon = new FitAddon();
const term = new Terminal({
  fontSize: 16,
  rightClickSelectsWord: true,
  letterSpacing: 0,
  allowTransparency: true,
  cursorBlink: true,
  cursorStyle: "bar",
  cols: 80,
  rows: 24,
  theme: {
    background: "#00000000",
  },
});
term.loadAddon(fitAddon);

term.onData((e) => {
  sendCharToServerTerminal(e);
});
term.onKey(function (data) {});

const sendCharToServerTerminal = (char, sender = false) => {
  if (sender) {
    char = char + "\r";
  }
  stompClient.send("/desktop/desktop", {}, char);
};

const PrefixInteger = (num, n) => {
  return (Array(n).join(0) + num).slice(-n);
};
onMounted(() => {
  const erd = elementResizeDetectorMaker();
  erd.listenTo(document.getElementById(props.item.id), (element) => {
    fitAddon.fit();
    var setSizeMessage =
      "setSize" +
      PrefixInteger(term.cols, 4) +
      PrefixInteger(term.rows, 4) +
      PrefixInteger(element.offsetWidth, 4) +
      PrefixInteger(element.offsetHeight, 4);

    if (stompClient.connected) {
      stompClient.send("/desktop/desktop", {}, setSizeMessage);
    }
  });

  let xterm = document.querySelector("#" + props.item.id + " #xterm-container");
  term.open(xterm);
  connectWebSocket();
});
const websocketConnected = (e) => {
  stompClient.subscribe("/topic/ssh", (response) => {
    term.write(response.body);
  });
  if (props.item.data.path != null) {
    sendCharToServerTerminal(`cd ${props.item.data.path}`, true);
  }
};
const websocketClose = (e) => {
  term.writeln("连接已断开！。");
};
const connectWebSocket = () => {
  let url = `${import.meta.env.VITE_APP_REQUEST_URL}desktop-socket-endpoint`;
  let socket = new SockJS(url);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, websocketConnected, websocketClose);
  stompClient.debug = null;
};
</script>

<style>
@import url("xterm/css/xterm.css");
@import url("../assets/less/terminal.less");
</style>