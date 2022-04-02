<template>
    <BaseWindow :item="item" className="success-message" backgroundClass="window-body-background-green">
      <template v-slot:body>
        <div class="fit-parent">{{state.message}}</div>
      </template>
      <template v-slot:header>
        <header>提示</header>
      </template>
    </BaseWindow>

</template>

<script setup>
import { defineProps, reactive } from "vue";
import { coolWindow, wact } from "../../windows/window-manager.js";
import BaseWindow from "../../components/window.vue";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});


let state = reactive({ ...props.item.data });
</script>

<style>
</style>