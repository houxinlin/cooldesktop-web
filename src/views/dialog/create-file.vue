<template>
  <BaseWindow :item="item" className="dialog-create-file" backgroundClass="window-body-background-green">
    <template v-slot:body>
      <div class="item">
        <header>名称:</header>
        <input class="base-input" v-model="targetName" type="text" />
      </div>

      <button class="base-button color-white red-a" @click="finish()">创建</button>
    </template>
    <template v-slot:header>
      <header>提示</header>
    </template>
  </BaseWindow>

</template>



<script setup>
import { defineProps, ref } from "vue";
import { wact } from "../../windows/window-manager.js";

import BaseWindow from "../../components/window.vue";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
const targetName = ref(props.item.data.targetName);

const finish = () => {
  wact.closeWindow(props.item.id);
  props.item.data.callback({ targetName: targetName.value }, props.item);
};
</script>

<style lang="less" >
@import "../../assets/less/dialog-create-file.less";
</style>