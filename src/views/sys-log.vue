<template>
  <BaseWindow :item="item" className="sys-log">
    <template v-slot:body>
      <div class="datas left-tab-layout color-white">
        <aside class="pos-fixed tbl0 ">
          <ul>
            <template v-for="(item,index) in logTypes.list" :key="item">
              <li @click="selectLogType(index)" class="" :class="[index==logTypes.select?'select':'']">
                <div>
                  <span>{{item}}</span>
                </div>
              </li>
            </template>
          </ul>
        </aside>
        <div class="left-tab-layout-container">
          <header class="sub-nav">
            <div class="nav-item flex">
              <span>周期:</span>
              <ul class="flex">
                <template v-for="(item,index) in filterTimer.list" :key="item">
                  <li @click="selectFilterTimer(index)" class="cursor-pointer" :class="[index==filterTimer.select?'select':'']">{{item}}</li>
                </template>
              </ul>
            </div>
            <div class="nav-item flex">
              <span>类型:</span>
              <ul class="flex">
                <template v-for="(item,index) in logLevel.list" :key="item">
                  <li @click="selectLogLevel(index)" class="cursor-pointer" :class="[index==logLevel.select?'select':'']">{{item}}</li>
                </template>
              </ul>
            </div>

          </header>
          <div class="list-container">
          </div>
          <footer class="">
          </footer>
        </div>
      </div>
    </template>
    <template v-slot:header>
      <header>日志</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
import { defineProps, onMounted, ref, getCurrentInstance, reactive } from "vue";
import { apiTailStart, apiTailStop } from "../http/folder.js"

let { proxy } = getCurrentInstance();

let navIndex = ref(0);

let filterTimer = reactive({ "list": ["全部", "今天", "三天内", "一周内"], "select": 0 });
let logLevel = reactive({ "list": ["全部", "信息", "错误"], "select": 0 });
let logTypes = reactive({ "list": ["接口日志", "系统日志", "应用程序日志", "登陆日志"], "select": 0 });

const selectFilterTimer = (index) => {
  filterTimer.select = index;
}
const selectLogLevel = (index) => {
  logLevel.select = index;
}
const selectLogType = (index) => {
  logTypes.select = index;
}
</script>

<style lang="less">
@import url("../assets/less/sys-log.less");
</style>