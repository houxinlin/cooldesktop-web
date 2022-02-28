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
                <img src="../assets/icon/ic-upload-manager.png" />
                <button v-if="installButtonVisable" @click="doInstallSoftware">安装</button>
                <div v-if="!installButtonVisable" class="progress">
                  <div :style="{width:installProgressWidth}"></div>
                  <span v-if="installProgress<=100">{{installProgress}}%</span>
                  <span v-if="installProgress==101">已安装</span>
                </div>
              </div>
              <div class="introduce">
                <div class="introduce-item">
                  <span class="key">名称:</span>
                  <span class="value">{{softwares.current.softwareName}}</span>
                </div>
                <div class="introduce-item">
                  <span class="key">大小:</span>
                  <span class="value">{{softwares.current.softwareSize}}MB</span>
                </div>
                <div class="introduce-item">
                  <span class="key">作者:</span>
                  <span class="value">{{softwares.current.softwareAuthor}}</span>
                </div>
                <div class="introduce-item">
                  <span class="key">简介:</span>
                  <span class="value">{{softwares.current.softwareDesc}}</span>
                </div>
              </div>
            </div>
            <div class="screenshot">
              <img src="https://img1.baidu.com/it/u=3975382827,1203451323&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" alt="">

              <img src="https://img1.baidu.com/it/u=3975382827,1203451323&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" alt="">

              <img src="https://img1.baidu.com/it/u=3975382827,1203451323&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" alt="">

              <img src="https://img1.baidu.com/it/u=3975382827,1203451323&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" alt="">

              <img src="https://img1.baidu.com/it/u=3975382827,1203451323&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500" alt="">
            </div>
          </div>
          <div v-if="layerIndex==LAYER_LIST" class="app-list-container">
            <ul>
              <template v-for="(item,index) in softwares.list" :key="index">
                <li @click="softwareDetail(index)" class="app-item">
                  <div class="file-item">
                    <img src="../assets/icon/ic-upload-manager.png" />
                    <span>{{item.softwareName}}</span>
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
const STATE_INSTALL = 1;

import * as softworeApi from "../http/software.js";

let state = reactive({ ...props.item.data });
let layerIndex = ref(LAYER_LIST)
let { proxy } = getCurrentInstance()
const installButtonVisable = ref(true)
const installProgress = ref(0)
const installProgressWidth = ref("0%")
const installState = ref(0)
let softwares = reactive({ types: [], list: [], current: {}, typeIndex: 0 })


const initEvent = () => {
  proxy.eventBus.on("/event/install/progress", (e) => {
    let downloadProgressValue = parseInt(e["data"])
    installProgress.value = downloadProgressValue
    installProgressWidth.value = downloadProgressValue + "%"
    if (downloadProgressValue == 100) {
      proxy.eventBus.emit("/refresh/application", {})
    }
  })
  proxy.eventBus.on("/event/refresh/application", (e) => {
    installState.value = 0
    installProgress.value = 101
  })
}

const initSoftwareList = () => {
  softworeApi.apiListAllSoftwareTypes().then((res) => {
    softwares.types = res.data
    listSoftwareByType(0, softwares.types[0].typeName)
  })

}
const listSoftwareByType = (index, name) => {
  if (installState.value == STATE_INSTALL) {
    return
  }
  softwares.typeIndex = index
  softworeApi.apiListAllSoftware(name).then((res) => {
    softwares.list = res.data
  })
}
const doInstallSoftware = () => {
  installButtonVisable.value = false
  installState.value = STATE_INSTALL
  softworeApi.apiInstallSoftware(softwares.current.id).then((res) => {
    softwares.list = res.data
  })
}
const goBackPage = () => {
  if (installState.value == STATE_INSTALL) {
    alert("a")
    return
  }
  layerIndex.value = LAYER_LIST
}
const softwareDetail = (index) => {
  layerIndex.value = LAYER_DETAIL
  softwares.current = softwares.list[index]
}
initSoftwareList()
initEvent()
</script>
<style lang="less">
@import "../assets/less/software.less";
</style>