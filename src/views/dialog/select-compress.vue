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
      'dialog-select': item.windowType == 'dialog-select',
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
        <header>压缩</header>
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
      <div class="window-body">
        <div class="item">
          <header>归档名称:</header>
          <input v-model="targetName" type="text" />
        </div>
        <div class="item">
          <header>归档类型:</header>
          <form>
            <span
              ><input
            
                v-model="radioVal"
                value="zip"
                name="select"
                type="radio"
              />.zip</span
            >
            <span
              ><input
                v-model="radioVal"
                value="tar"
                name="select"
                type="radio"
              />tar.xz</span
            >
            <span
              ><input
                v-model="radioVal"
                value="7z"
                name="select"
                type="radio"
              />7z</span
            >
          </form>
        </div>
        <button @click="finish()">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../../windows/window-manager.js";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});
const radioVal = ref("zip");
const targetName = ref(props.item.data.targetName);

const finish = () => {
  wact.closeWindow(props.item.id);

  props.item.data.callback(
    { targetName: targetName.value, type: radioVal.value },
    props.item
  );
};
</script>

<style>
</style>