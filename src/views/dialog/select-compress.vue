<template>
  <BaseWindow :item="item" className="dialog-compress-select">
    <template v-slot:body>
      <div class="item">
        <header>归档名称:</header>
        <input v-model="targetName" type="text" />
      </div>
      <div class="item">
        <header>归档类型:</header>
        <form>
          <span><input v-model="radioVal" value="zip" name="select" type="radio" />.zip</span>
          <span><input v-model="radioVal" value="tar" name="select" type="radio" />tar.gz</span>
          <span><input v-model="radioVal" value="7z" name="select" type="radio" />7z</span>
        </form>
      </div>
      <button @click="finish()">确认</button>
    </template>
    <template v-slot:header>
      <header>压缩</header>
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

<style lang="less">
@import "../../assets/less/dialog-compress-select.less";
</style>