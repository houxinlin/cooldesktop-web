<template>
  <BaseWindow :item="item" className="software">
    <template v-slot:body>
      <aside>
        <ul>
          <li class="cursor-pointer hegiht-50px flex flex-align-items-center" @click="listSoftwareByType(index,'已安装')" :class="{'select':softwares.typeIndex==index}">已安装</li>
          <template v-for="(item,index) in softwares.types" :key="item.id">
            <li class="cursor-pointer hegiht-50px flex flex-align-items-center" @click="listSoftwareByType(index,item.typeName)" :class="{'select':softwares.typeIndex==index}">{{item.typeName}}</li>
          </template>
        </ul>
      </aside>
      <div class="flex-1 color-white container">
        <div v-if="layerIndex==LAYER_DETAIL" class="app-install-container">
          <div class="header-info">
            <div class="flex flex-column color-white logo">
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
          <ul class="grid-justify-content-center">
            <template v-for="(item,index) in softwares.list" :key="index">
              <li class="cursor-pointer flex flex-all-center width-height-90" @click="softwareDetail(index)">
                <div class="flex flex-all-center color-white flex-column software-item">
                  <img class="wh-40 cover" :src="softwareServerHost+item.software.softwareLogoUrl" />
                  <span>{{item.software.softwareName}}</span>
                </div>
              </li>
            </template>

          </ul>
        </div>
        <div v-if="layerIndex==LAYER_INSTALL" class="app-list-container">
          <ul class="flex-col">
            <template v-for="(item,index) in applicationState.applications" :key="index">
              <li class="app-item padding-10">
                <div class="software-item flex flex-space-between">
                  <div class="flex-all-center flex">
                    <img class="wh-40 cover" :src=" serverDomain + 'desktop/webapplication/' + item.applicationId + '/logo.png'" alt="" />
                    <span class="margin-l-10">{{item.applicationName}}</span>
                  </div>
                  <div>
                    <button @click="uninstall(item.applicationId)" class="base-button blue">卸载</button>
                  </div>
                </div>
              </li>
            </template>

          </ul>
        </div>

      </div>
    </template>
    <template v-slot:header>
      <header>
        <div class="fit-parent flex flex-align-items-center">
          <img @click="goBackPage" v-if="layerIndex==LAYER_DETAIL" src="../assets/icon/ic-return.png">
        </div>
      </header>
    </template>
  </BaseWindow>

</template>


<script setup>
import { defineProps, reactive, ref, getCurrentInstance } from "vue";
import BaseWindow from "../components/window.vue";
let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);
const props = defineProps({
  item: Object,
  actionWindowId: String,
});
const { proxy } = getCurrentInstance()

const LAYER_LIST = 1;
const LAYER_DETAIL = 2;
const STATE_INSTALLING = 1;
const LAYER_INSTALL = 3
import * as softworeApi from "../http/software.js";

let state = reactive({ ...props.item.data });
let layerIndex = ref(LAYER_LIST)
let softwares = reactive({ types: [], list: [], current: {}, typeIndex: 0, installed: [] })
let softwareServerHost = import.meta.env.VITE_APP_SOFTWARE_SERVER_URL
let installStatus = ref(null);
import { beginInstall, getRefProgressValue, clearRefProgressValue } from "../utils/install-progress-manager.js"
import { listApplication, applicationState } from "../global/application.js"
import { coolWindow } from "../windows/window-manager";

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
  softwares.typeIndex = index
  softwares.list = []
  if (name === "已安装") {
    layerIndex.value = LAYER_INSTALL
    refreshInstalled()
    return
  }

  softworeApi.apiListAllSoftware(name).then((res) => {
    softwares.list = res.data
  })
}
const refreshInstalled = () => {

}
//安装软件
const doInstallSoftware = () => {
  beginInstall(softwares.current.software.softwareId)
}

function uninstall(id) {
  let loadingWindow = coolWindow.startNewLoadingView("卸载中")
  softworeApi.apiUnInstallSoftware(id).then((res) => {
    //刷新应用程序列表
    proxy.eventBus.emit("/event/refresh/application", {})
    loadingWindow.closeWindow()
    refreshInstalled()
    coolWindow.startNewSuccessMessageDialog(res.data.data)
    clearRefProgressValue(id)
  })
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