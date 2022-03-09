<template>
  <div :data-id="item.id" :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      'dialog-create-file': item.windowType == 'dialog-create-file',
    }" class="window-item" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <div @click="wact.setWindowPos(item.id)" :class="{ action: actionWindowId == item.id }" class="window-mask"></div>
    <div class="window-content">
      <div class="window-title base-title">
        <header>新建文件</header>
        <div class="opt">
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div class="window-body">
        <div class="item">
          <header>名称:</header>
          <input class="base-input" v-model="targetName" type="text" />
        </div>

        <button class="base-button blue" @click="finish()">创建</button>
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
  props.item.data.callback({ targetName: targetName.value }, props.item);
};
</script>

<style lang="less" >
@import "../../assets/less/dialog-create-file.less";
</style>