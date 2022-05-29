<template>
  <BaseWindow :item="item" className="terminal">
    <template v-slot:body>
      <div class="xterm-container"></div>
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

import { defineProps, onMounted, ref, getCurrentInstance } from "vue";
import { createTerminalInstance } from "../utils/xterm.js"
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from 'xterm-addon-attach';
let windowTitle = ref("连接中...")
let terminalSocket = null
let listenerWindowSizeEventTimerId = null
let term = null
const fitAddon = new FitAddon();
const instance = [createTerminalInstance(), createTerminalInstance(), createTerminalInstance(), createTerminalInstance(), createTerminalInstance()]
//事件监听
props.item.events = function (name, data) {
  //关闭窗口
  if (name == "close" && term != null) {
    //断开连接
    if (terminalSocket != null) terminalSocket.close()
    terminalSocket = null
    term.dispose()
    term.clear()
    term.clearSelection()
    term.reset()
    clearInterval(listenerWindowSizeEventTimerId)
  }
  //大小改变
  if (name == "sizeChange" && term != null) {
    fitAddon.fit();
    var setSizeMessage =
      "setSize" +
      prefixInteger(term.cols, 4) +
      prefixInteger(term.rows, 4) +
      prefixInteger(data.width, 4) +
      prefixInteger(data.height, 4);
    terminalWindowSizeData = setSizeMessage
  }
};

let { proxy } = getCurrentInstance()
proxy.eventBus.on("/event/message/terminal", (e) => {
  writeMegToTerm(e.msg)
})
let terminalWindowSizeData = ""

const prefixInteger = (num, n) => {
  return (Array(n).join(0) + num).slice(-n);
};
function deleteChild() {
  var e = document.querySelector(`#${props.item.id} .xterm-container`);
  var first = e.firstElementChild;
  while (first) {
    first.remove();
    first = e.firstElementChild;
  }
}
const createTerminal = () => {
  term = new Terminal({
    fontSize: 15,
    rightClickSelectsWord: true,
    letterSpacing: 0,
    allowTransparency: true,
    cursorBlink: true,
    cursorStyle: "bar",
    lineHeight: 1.2,
    cols: 65,
    rows: 20,
    theme: {
      foreground: "#ffffff",
      background: "#00000000",
    },
  });
  term.loadAddon(fitAddon);
  term.open(document.querySelector(`#${props.item.id} .xterm-container`));

}
onMounted(() => {
  deleteChild()
  createTerminal();
  connectWebSocket();
  listenerWindowSizeEventTimerId = setInterval(() => {
    if (terminalSocket != null && terminalWindowSizeData != "") {
      terminalSocket.send(terminalWindowSizeData)
      terminalWindowSizeData = ""
    }
  }, 1000);
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
    terminalSocket.send(`cd ${props.item.data.path} \r`)
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

<style lang="less">
@import url("xterm/css/xterm.css");
@import url("../assets/less/terminal.less");
</style>