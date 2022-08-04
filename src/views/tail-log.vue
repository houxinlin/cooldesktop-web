<template>
  <BaseWindow :item="item" className="tail">
    <template v-slot:body>
      <div class="datas">
        <template v-for="item in data" v-key="item">
          <div>{{item}}</div>
        </template>
      </div>
    </template>
    <template v-slot:header>
      <header>{{props.item.data.path}}</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
import { defineProps, onMounted, ref, getCurrentInstance } from "vue";
import { apiTailStart, apiTailStop } from "../http/folder.js"

let { proxy } = getCurrentInstance();
let data = ref([]);
let taskId = "";
let windowBody = null;
let eventKey = `/event/tail/${props.item.data.path}`;
let eventHandler = (e) => {
  data.value.push(e.data);
  if (windowBody == null) windowBody = document.querySelector(`#${props.item.id} .window-body`);
 setTimeout(() => {
    windowBody.scrollTop = windowBody.scrollHeight + 10;
 }, 0);
}
const props = defineProps({
  item: Object,
  actionWindowId: String,
});

onMounted(() => {
  apiTailStart(props.item.data.path).then((response) => {
    taskId = response.data.data;
    proxy.eventBus.on(eventKey, eventHandler);
  })
})
props.item.events = function (name, data) {
  if (name == "close") {
    apiTailStop(taskId).then((response) => { });
    proxy.eventBus.off(eventKey, eventHandler);
  }
};

</script>

<style lang="less">
.tail .window-body {
  color: #ffffff;
  padding: 5px;
  .datas div{
    font-size: 14px;
    user-select: text;
  }
}
</style>