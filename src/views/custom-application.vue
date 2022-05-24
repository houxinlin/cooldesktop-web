<template>
  <BaseWindow :item="item" className="custom-application">
    <template v-slot:body>
      <div @dragstart="dragstart" @dragover="dragover" @dragleave="dragleave" @drop="drop" class="fit-parent ">
        <div class="flex fit-parent  color-white  flex-column flex-all-center">
          <div>{{state.tips}}</div>
          <img @mousedown="imgMousedown" :class="[state.imageClass]" class="margin-t-10px" :src="state.imageUrl" alt="">
        </div>
      </div>
    </template>
    <template v-slot:header>
      <header>自定义软件</header>
    </template>
  </BaseWindow>

</template>

<script setup>
import { defineProps, reactive } from "vue"
import BaseWindow from "../components/window.vue"
import { apiInstallCustomApplication } from "../http/application.js"
let defaultImageUrl = new URL(`../assets/icon/ic-drag.png`, import.meta.url).href
let loadingImageUrl = new URL(`../assets/icon/ic-loading.png`, import.meta.url).href
import { coolWindow } from "../windows/window-manager.js";
let state = reactive({ "imageUrl": defaultImageUrl, "tips": "请将软件托放到这里", "imageClass": "" })

const props = defineProps({
  item: Object,
  actionWindowId: String,
});
const imgMousedown = (e) => {
  e.preventDefault()
}
const dragstart = (event) => {
}
const dragover = (event) => {
  event.preventDefault();
};
const dragleave = (event) => {
};

const drop = (event) => {
  event.preventDefault();
  let files = event.dataTransfer.files;
  if (files.length == 0) { return }
  let formData = new FormData()
  formData.set("file", files[0])

  let axiosConfig = {
    timeout: 1000 * 60 * 15,
    headers: {},
    onUploadProgress: function (progressEvent) {
      let percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      state.tips = `上传中${percentCompleted}%`
    }
  };
  state.imageUrl = loadingImageUrl
  state.imageClass = "element-rotate"
  //上传并且安装自定义软件
  apiInstallCustomApplication(formData, axiosConfig).then((res) => {
    coolWindow.startNewSuccessMessageDialog(res.data.data)
    resetState()
  })

  resetState()
};
const resetState = () => {
  state.imageUrl = defaultImageUrl
  state.tips = "请将软件托放到这里"
  state.imageClass = ""
}

</script>

<style>
</style>
