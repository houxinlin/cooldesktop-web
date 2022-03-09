<template>
  <BaseWindow :item="item" className="terminal">
    <template v-slot:body>
      <div id="xterm-container"></div>
    </template>
    <template v-slot:header>
      <header>{{windowTitle}}</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
props.item.events = function (e, d) {
  if (e == "close") {
    //断开连接
    terminalSocket.close()
    terminalSocket = null
    term.dispose()
    term.clear()
    term.clearSelection()
    term.reset()
    clearInterval(listenerWindowSizeEventTimerId)
  }
};

import elementResizeDetectorMaker from "element-resize-detector";

import { defineProps, onMounted, ref, getCurrentInstance } from "vue";
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
    foreground: "#ffffff",
    background: "#00000000",
  },
});

let { proxy } = getCurrentInstance()
proxy.eventBus.on("/event/message/terminal", (e) => {
  writeMegToTerm(e.msg)
})


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
  term.clear()
  term.clearSelection()
  term.reset()
  term.open(xterm);
  connectWebSocket();
});

const websocketClose = (e) => {
  writeMegToTerm("连接已断开！。" + e)
};
const writeMegToTerm = (msg) => {
  term.writeln(msg);
}
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