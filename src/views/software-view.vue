<template>
  <div :id="item.id" :data-id="item.id" :class="{
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-z-height': item.actionWindow,
      'software': item.windowType == 'software',
    }" class="window-item window-item-resize" @mousedown="wact.windowMove" @mouseup="wact.windowMouseUp">
    <!-- <div
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div> -->
    <div class="window-content">
      <div class="window-title">
        <header>
          <img @click="goBackPage" v-if="layerIndex==LAYER_DETAIL" src="../assets/icon/ic-return.png">
        </header>
        <div class="opt">
          <i class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div class=" window-body">

        <aside>
          <ul>
            <template v-for="(item,index) in softwares.types" :key="item.id">
              <li @click="listSoftwareByType(index,item.typeName)" :class="{'select':softwares.typeIndex==index}">{{item.typeName}}</li>
            </template>
          </ul>
        </aside>
        <div class="container">
          <div v-if="layerIndex==LAYER_DETAIL" class="app-install-container">
            <div class="header-info">
              <div class="logo">
                <img :src="softwareServerHost+softwares.current.software.softwareLogoUrl" />
                <button v-if="installStatus.value==0" @click="doInstallSoftware">安装</button>
                <button v-if="installStatus.value==-1">已安装</button>
                <div v-if="installStatus.value>0" class="progress">
                  <div :style="{width:installStatus.value+'%'}"></div>
                  <span v-if="installStatus.value<100">{{installStatus}}%</span>
                  <span v-if="installStatus.value==100">安装中...</span>
                </div>
              </div>
              <div class="introduce">
                <div class="introduce-item">
                  <span class="key">名称:</span>
                  <span class="value">{{softwares.current.software.softwareName}}</span>
                </div>
                <div class="introduce-item">
                  <span class="key">大小:</span>
                  <span class="value">{{softwares.current.software.softwareSize}}MB</span>
                </div>
                <div class="introduce-item">
                  <span class="key">作者:</span>
                  <span class="value">{{softwares.current.software.softwareAuthor}}</span>
                </div>
                <div class="introduce-item">
                  <span class="key">简介:</span>
                  <span class="value">{{softwares.current.software.softwareDesc}}</span>
                </div>
              </div>
            </div>
            <div class="screenshot">
              <template v-for="item in softwares.current.screenshots" :key="item">
                <img :src="softwareServerHost+item.imageUrl" alt="">
              </template>
            </div>
          </div>
          <div v-if="layerIndex==LAYER_LIST" class="app-list-container">
            <ul>
              <template v-for="(item,index) in softwares.list" :key="index">
                <li @click="softwareDetail(index)" class="app-item">
                  <div class="file-item">
                    <img :src="softwareServerHost+item.software.softwareLogoUrl" />
                    <span>{{item.software.softwareName}}</span>
                  </div>
                </li>
              </template>

            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive, ref, getCurrentInstance } from "vue";
import { wact } from "../windows/window-manager.js";

const props = defineProps({
  item: Object,
  actionWindowId: String,
});

const LAYER_LIST = 1;
const LAYER_DETAIL = 2;
const STATE_INSTALLING = 1;
import * as softworeApi from "../http/software.js";

let state = reactive({ ...props.item.data });
let layerIndex = ref(LAYER_LIST)
let softwares = reactive({ types: [], list: [], current: {}, typeIndex: 0 })
let softwareServerHost = import.meta.env.VITE_APP_SOFTWARE_SERVER_URL
let installStatus = ref(null);
import { beginInstall, getRefProgressValue } from "../utils/install-progress-manager.js"


//初始化软件类型
const initSoftwareList = () => {
  softworeApi.apiListAllSoftwareTypes().then((res) => {
    softwares.types = res.data
    listSoftwareByType(0, softwares.types[0].typeName)
  })

}
//更具类型获取所有软件
const listSoftwareByType = (index, name) => {

  layerIndex.value = LAYER_LIST
  softwares.list = []
  softwares.typeIndex = index
  softworeApi.apiListAllSoftware(name).then((res) => {
    softwares.list = res.data
  })
}
//安装软件
const doInstallSoftware = () => {
  beginInstall(softwares.current.software.softwareId)
}
//返回主页
const goBackPage = () => {
  layerIndex.value = LAYER_LIST
}
//查看详细
const softwareDetail = (index) => {
  layerIndex.value = LAYER_DETAIL
  softwares.current = softwares.list[index]
  installStatus.value = getRefProgressValue(softwares.current.software.softwareId)
}

initSoftwareList()
// initEvent()
</script>
<style lang="less">
@import "../assets/less/software.less";
</style>