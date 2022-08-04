<template>
  <BaseWindow :item="item" className="sys-log">
    <template v-slot:body>
      <div class="datas">
          a
      </div>
    </template>
    <template v-slot:header>
      <header>日志</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
import { defineProps, onMounted, ref, getCurrentInstance } from "vue";
import { apiTailStart, apiTailStop } from "../http/folder.js"

let { proxy } = getCurrentInstance();


</script>

<style lang="less">
.tail .window-body {
  color: #ffffff;
  padding: 5px;
  .datas div {
    font-size: 14px;
    user-select: text;
  }
}
</style>