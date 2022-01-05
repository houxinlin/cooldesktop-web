<template>
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
      terminal: item.windowType == 'terminal',
    }"
    class="window-item"
    @mousedown="wact.windowMove"
    @mouseup="wact.windowMouseUp"
  >
    <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div>
    <div class="window-content">
      <div class="window-title base-title">
        <header>终端</header>
        <div class="opt">
          <i
            class="iconfont icon-tzuixiaohua"
            @click="wact.windowMin(item.id)"
          ></i>
          <i
            class="iconfont icon-big"
            @click="wact.windowFullScreen(item.id)"
          ></i>
          <i
            class="iconfont icon-webicon309"
            @click="wact.closeWindow(item.id)"
          ></i>
        </div>
      </div>
      <div style="padding: 10px" class="window-body">
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
import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
import Stomp from "stompjs";
let stompClient = null;
import { Terminal } from "xterm";

const term = new Terminal({
  fontSize: 17,
  rightClickSelectsWord: true,
  // fontFamily:"楷体",
  letterSpacing: 0,
  fontWeight: 500,
  allowTransparency: true,
  cursorBlink: true,
  cursorStyle: "bar",
  cols: 73,
  rows: 23,
  // onCursorMove:(e)=>{
  //   console.log(e)
  // },

  windowOptions: {
    fullscreenWin: true,
  },
  theme: {
    background: "#00000000",
  },
});

term.onKey(function (data) {
  if (data.key == "\x7F") {
    term.write("\b \b");
    return;
  }
  if (data.key == "\r") {
    term.writeln("");
    return;
  }
  term.write(data.key);
  sendCharToServerTerminal(data.key);
  console.log("ss")
});

const sendCharToServerTerminal = (char) => {
  stompClient.send("/app/hello", {}, char);
};

onMounted(() => {
  term.open(document.getElementById("xterm-container"));
  connect();
});

const connect = () => {
  let url = "http://localhost:8080/desktop-socket-endpoint";
  let socket = new SockJS(url);
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    () => {
      stompClient.subscribe("/topic/a", (response) => {
        console.log(response);
      });
    },
    (err) => {
      console.log("失败");
    }
  );
};
</script>

<style>
@import url("xterm/css/xterm.css");
</style>