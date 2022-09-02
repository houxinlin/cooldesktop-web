<template>
  <BaseWindow :item="item" className="error-message">
    <template v-slot:body>
      <div class="fit-parent padding-10px"> {{ state.message }}</div>
    </template>
    <template v-slot:header>
      <header>提示</header>
    </template>
  </BaseWindow>

</template>

<script setup>
import { defineProps, reactive } from "vue";
import BaseWindow from "../../components/window.vue";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});


let state = reactive({ ...props.item.data });
</script>

<style>
</style>
