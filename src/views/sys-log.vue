<template>
  <BaseWindow :item="item" className="sys-log">
    <template v-slot:body>
      <div class="datas left-tab-layout color-white">
        <aside class="pos-fixed tbl0 ">
          <ul>
            <template v-for="(item,index) in logType.list" :key="item">
              <li @click="selectLogType(index)" class="" :class="[index==logType.select?'select':'']">
                <div>
                  <span>{{item}}</span>
                </div>
              </li>
            </template>
          </ul>
        </aside>
        <div class="left-tab-layout-container log-container">
          <header class="sub-nav ">
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
            <div class="table-layout">
              <header class="">
                <ul>
                  <li>级别</li>
                  <li>名称</li>
                  <li>信息</li>
                  <li>时间</li>
                  <li>IP</li>
                </ul>
              </header>
              <ul class="table-body">
                <template v-for="(item,index) in logs.list" :key="index">
                  <li :class="[index==logs.select?'select':'']" @click="logs.checked=item;logs.select=index;">
                    <span>{{item.LOG_LEVEL}}</span>
                    <span>{{item.LOG_NAME}}</span>
                    <span>{{item.LOG_VALUE}}</span>
                    <span>{{item.LOG_TIME}}</span>
                    <span>{{item.IP}}</span>
                  </li>
                </template>

              </ul>
              <div class="page">
                <template v-for="item in pageSize" :key="item">
                  <button :class="[currentPage==item?'select':'']" @click="listLog(item)">{{item}}</button>
                </template>
              </div>
            </div>
          </div>

          <footer v-if="logs.select>=0" class="">
            <span>信息</span>
            <div class="line"></div>
            <span>{{logs.checked.LOG_VALUE}}</span>
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
import { apiGetSystemLog } from "../http/system.js";
let { proxy } = getCurrentInstance();
let navIndex = ref(0);

let filterTimer = reactive({ "list": ["全部", "今天", "三天内", "一周内"], "select": 0 });
let logLevel = reactive({ "list": ["全部", "信息", "错误"], "select": 0 });
let logType = reactive({ "list": ["接口日志", "系统日志", "应用程序日志", "登陆日志"], "select": 1 });
let logs = reactive({ "list": [], "checked": {}, "select": -1 });
let pageSize = ref(0)
let currentPage = ref(0)
const selectFilterTimer = (index) => {
  filterTimer.select = index;
  listLog();
}
const selectLogLevel = (index) => {
  logLevel.select = index;
  listLog();
}
const selectLogType = (index) => {
  logType.select = index;
  listLog();
}
// 获取日志
const listLog = (page = 1) => {
  logs.checked = {};
  logs.select = -1
  let lType = logType.list[logType.select];  //日志类型
  let lLevel = logLevel.list[logLevel.select]; //日志级别
  let lTimer = filterTimer.list[filterTimer.select]; //时间过滤
  apiGetSystemLog(lType, lLevel, lTimer, page).then((response) => {
    logs.list = response.data.data.datas;
    currentPage.value = response.data.data.current;
    let total = response.data.data.total;
    let size = response.data.data.size;
    let result = (total % size) != 0 ? parseInt(total / size) + 1 : parseInt(total / size);
    pageSize.value = result;
  })
}

listLog();
</script>

<style lang="less">
@import url("../assets/less/sys-log.less");
</style>