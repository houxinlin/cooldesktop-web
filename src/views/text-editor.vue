<template>
  <div
    :id="item.id"
    :data-id="item.id"
    :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      'text-editor': item.windowType == 'text-editor',
    }"
    class="window-item window-item-resize"
    @mousedown="wact.windowMove"
    @mouseup="wact.windowMouseUp"
  >
    <!-- <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div> -->
    <div class="window-content">
      <div class="window-title base-title">
        <header>编辑</header>
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
      <div style="padding: 0px" class="window-body">
        <v-ace-editor
          v-model:value="content"
          @init="editorInit"
          lang="java"
          aria-modal="ace/mode/java"
          theme="monokai"
          :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            tabSize: 4,
            fontSize: 16,
            showPrintMargin: false, //去除编辑器里的竖线
          }"
          style="height: 300px"
        />
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
import { VAceEditor } from "vue3-ace-editor";

props.item.events = function (e, d) {
  if (e == "close") {
  }
};

const editorInit = (editor) => {
};

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-monokai';
</script>

<style>
@import url("xterm/css/xterm.css");
@import url("../assets/less/terminal.less");
</style>