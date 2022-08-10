<template>
  <BaseWindow :item="item" className="input-dialog" backgroundClass="window-body-background-green">
    <template v-slot:body>
      <div class="item">
        <header></header>
        <input class="base-input" v-model="targetName" type="text" />
      </div>

      <button class="base-button color-white red-a" @click="finish()">确定</button>
    </template>
    <template v-slot:header>
      <header>{{props.item.data.title}}</header>
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
const targetName = ref(props.item.data.defaultValue);
const finish = () => {
  wact.closeWindow(props.item.id);
  props.item.data.callback({ targetName: targetName.value }, props.item);
};
</script>

<style lang="less" >
@import "../../assets/less/input-dialog.less";
</style>