<template>
  <BaseWindow :item="item" className="share-link" backgroundClass="window-body-background-red">
    <template v-slot:body>
      <div class="user-select-text fit-parent color-white flex flex-column  flex-all-center">
        <span>{{prefix}}{{state.data}}</span>
        <button style="margin-top:10px" class="color-white base-button white-translucent" @click="copy">复制链接</button>
      </div>
    </template>
    <template v-slot:header>
      <header>共享成功</header>
    </template>
  </BaseWindow>

</template>

<script setup>
import { defineProps, reactive } from "vue";
import { coolWindow, wact } from "../../windows/window-manager.js";
import BaseWindow from "../../components/window.vue";
import { copyText } from 'vue3-clipboard'

const props = defineProps({
  item: Object,
  actionWindowId: String,
});

let prefix=import.meta.env.VITE_APP_REQUEST_URL+"s/";

let state = reactive({ ...props.item.data });

const copyToClipboard = (str) => {
  copyText(str, undefined, (error, event) => { })
  postMessage({ "action": "notification", "param": { "message": "复制成功", "type": "success" } }, "*")
 
};
const copy = () => {
  let data = `${import.meta.env.VITE_APP_REQUEST_URL}s/${state.data}`;
  copyToClipboard(data);
}
</script>

<style lang="less" >
.container {
}
</style>