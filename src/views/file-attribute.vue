<template>
  <BaseWindow :item="item" className="file-attribute">
    <template v-slot:body>
      <header class="icon">
        <img :src="
              request +
              'desktop/api/file/getFileIconByType?type=' +
              state.attribute.type
            " alt="" />
      </header>
      <div class="item-info">
        <span class="name">文件名称:</span>
        <span class="value">{{ state.attribute.name }}</span>
      </div>
      <div class="item-info">
        <span class="name">大小:</span>
        <span class="value">{{ sizeFormate(state.attribute.fileSize) }}</span>
      </div>
      <div class="item-info">
        <span class="name">创建时间:</span>
        <span class="value">{{ millisFormate(state.attribute.createTimer) }}</span>
      </div>
      <div class="item-info">
        <span class="name">最后修改时间:</span>
        <span class="value">{{ millisFormate(state.attribute.lastModifiedTime) }}</span>
      </div>
      <div class="item-info">
        <span class="name">最后访问时间:</span>
        <span class="value">{{  millisFormate(state.attribute.lastAccessTime)}}</span>
      </div>
      <div class="item-info">
        <span class="name">所有者:</span>
        <span class="value">{{ state.attribute.owner }}</span>
      </div>
    </template>
    <template v-slot:header>
      <header>提示</header>
    </template>
  </BaseWindow>

</template>


<script setup>
import { defineProps, reactive, ref } from "vue";
import { apiFileAttribute } from "../http/folder.js";
import BaseWindow from "../components/window.vue";

let request = ref(import.meta.env.VITE_APP_REQUEST_URL);
const props = defineProps({
  item: Object,
  actionWindowId: String,
});

const sizeFormate = (size) => {
  if (size < 1024) {
    return size + "字节";
  }
  if (size / 1024 < 1024) {
    return Math.floor(size / 1024) + "KB";
  }
  return Math.round(size / 1024 / 1024) + "MB";
};
const millisFormate = (l) => {
  var date = new Date(l);
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
};

let state = reactive({ attribute: {} });
apiFileAttribute(props.item.data.path).then((res) => {
  state.attribute = res.data.data;
});
</script>

<style>
</style>