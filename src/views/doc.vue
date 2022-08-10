<template>
  <BaseWindow :item="item" className="developer-doc web">
    <template v-slot:body>
      <div class="iframe">
        <iframe class="" src="https://houxinlin.com/DeveloperCoolDesktop.html" frameborder="0"></iframe>

      </div>
    </template>
    <template v-slot:header>
      <header>开发文档</header>
    </template>
  </BaseWindow>

</template>

<script setup>
import { defineProps } from "vue"
import BaseWindow from "../components/window.vue"
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
</script>

<style>
</style>
