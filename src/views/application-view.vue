<template>
  <BaseWindow :item="item" className="software">
    <template v-slot:body>
      <div class="left-tab-layout">
        <aside class="pos-fixed  color-white">
          <ul>
            <!-- 增加已安装 -->
            <li class="cursor-pointer hegiht-50px flex flex-align-items-center" @click="listApplicationByType(-1,'已安装')" :class="{'select':serverApplicationState.typeIndex==-1}">已安装</li>
            <!-- 类别集合 -->
            <template v-for="(item,index) in serverApplicationState.types" :key="item.id">
              <li class="cursor-pointer hegiht-50px flex flex-align-items-center" @click="listApplicationByType(index,item.typeName)" :class="{'select':serverApplicationState.typeIndex==index}">{{item.typeName}}</li>
            </template>
          </ul>
        </aside>
        <div class="left-tab-layout-container">
          <div class="color-white container">
            <!-- 详细试图 -->
            <div v-if="layerIndex==LAYER_DETAIL" class="app-install-container">
              <div class="header-info">
                <div class="flex flex-column color-white logo">
                  <img :src="imageAddressPrefix+serverApplicationState.current.software.softwareLogoUrl" />
                  <div v-if="installStatus.value>=0" class="progress">
                    <div class="flex flex-all-center" :style="{width:installStatus.value+'%'}"></div>
                    <span class="value">{{installStatus}}</span>
                  </div>
                  <div v-if="installStatus.value<0" class="progress">
                    <button v-if="installStatus.value==-2" @click="doInstallApplication">安装</button>
                    <span v-if="installStatus.value==-3">已安装</span>
                    <span v-if="installStatus.value==-4">安装中</span>
                    <span v-if="installStatus.value==-5" @click="doInstallApplication">安装失败</span>
                    <span class="background-green" v-if="installStatus.value==-6" @click="doUpdataApplication">更新</span>
                  </div>
                </div>
                <div class="introduce">
                  <div class="introduce-item">
                    <span class="key">名称:</span>
                    <span class="value">{{serverApplicationState.current.software.softwareName}}</span>
                  </div>
                  <div class="introduce-item">
                    <span class="key">大小:</span>
                    <span class="value">{{sizeFormate(serverApplicationState.current.software.softwareSize)}}</span>
                  </div>
                  <div class="introduce-item">
                    <span class="key">作者:</span>
                    <span class="value">{{serverApplicationState.current.software.softwareAuthor}}</span>
                  </div>
                  <div class="introduce-item">
                    <span class="key">简介:</span>
                    <span class="value">{{serverApplicationState.current.software.softwareDesc}}</span>
                  </div>
                  <div class="introduce-item">
                    <span class="key">版本:</span>
                    <span class="value">{{serverApplicationState.current.software.softwareVersion}}</span>
                  </div>
                </div>
              </div>
              <div class="screenshot">
                <template v-for="item in serverApplicationState.current.screenshots" :key="item">
                  <img :src="imageAddressPrefix+item.imageUrl" alt="">
                </template>
              </div>
            </div>
            <!-- 列表视图 -->
            <div v-if="layerIndex==LAYER_LIST" class="app-list-container">
              <ul class="grid-justify-content-center">
                <template v-for="(item,index) in serverApplicationState.list" :key="index">
                  <li class="cursor-pointer flex flex-all-center width-height-90px" @click="applicationDetail(index)">
                    <div class="flex flex-all-center color-white flex-column software-item">
                      <img class="wh-40px cover" :src="imageAddressPrefix+item.software.softwareLogoUrl" />
                      <span>{{item.software.softwareName}}</span>
                    </div>
                  </li>
                </template>

              </ul>
            </div>
            <!-- 已安装试图 -->
            <div v-if="layerIndex==LAYER_INSTALLED" class="app-list-container">
              <ul class="flex-col">
                <template v-for="(item,index) in applicationState.applications" :key="index">
                  <li class="app-item padding-10px">
                    <div class="software-item flex flex-space-between">
                      <div class="flex-all-center flex">
                        <img class="wh-40px cover" :src=" serverDomain + 'desktop/webapplication/' + item.applicationId + '/logo.png'" alt="" />
                        <span class="margin-l-10px">{{item.applicationName}}</span>
                      </div>
                      <div>
                        <button @click="uninstall(item.applicationId)" class="base-button color-white red">卸载</button>
                      </div>
                    </div>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </template>
    <template v-slot:header>
      <header>
        <!-- 头部，用来返回 -->
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
import { sizeFormate, getSystemAddressByKey } from "../utils/utils.js"
import { beginInstall, getRefProgressValue, clearRefProgressValue } from "../utils/install-progress-manager.js"
import { applicationState, refreshApplication } from "../global/application.js"
import { coolWindow } from "../windows/window-manager";
import * as applicationApi from "../http/application.js";


const props = defineProps({
  item: Object,
  actionWindowId: String,
});
let serverDomain = ref(getSystemAddressByKey("host"));

const LAYER_LIST = 1;
const LAYER_DETAIL = 2;
const LAYER_INSTALLED = 3

let state = reactive({ ...props.item.data });
let layerIndex = ref(LAYER_LIST)
let serverApplicationState = reactive({ types: [], list: [], current: {}, typeIndex: 0, installed: [] })
let imageAddressPrefix = ref(`${serverDomain.value}desktop/api/application/server/resource/get/`)
let installStatus = ref(null);


//初始化软件类型
const initApplicationList = () => {
  applicationApi.apiListAllApplicationType().then((res) => {
    serverApplicationState.types = res.data.data
  })

}
//更具类型获取所有软件
const listApplicationByType = (index, name) => {
  layerIndex.value = LAYER_LIST
  serverApplicationState.typeIndex = index
  serverApplicationState.list = []
  if (name === "已安装") {
    layerIndex.value = LAYER_INSTALLED
    refreshInstalled()
    return
  }

  applicationApi.apiListAllApplicationByType(name).then((res) => {
    serverApplicationState.list = res.data.data
  })
}
const refreshInstalled = () => {
  refreshApplication()
}
//安装软件
const doInstallApplication = () => {
  beginInstall(serverApplicationState.current.software.softwareId)
}
const doUpdataApplication = () => {
  beginInstall(serverApplicationState.current.software.softwareId)
}

function uninstall(id) {
  let loadingWindow = coolWindow.startNewLoadingView("卸载中")
  applicationApi.apiUnInstallApplication(id).then((response) => {
    //刷新应用程序列表
    loadingWindow.closeWindow()
    postMessage({ "action": "notification", "param": { "message": response.data.data, "type": "success" } }, "*")
    clearRefProgressValue(id)
    refreshInstalled()
  })
}
//返回主页
const goBackPage = () => {
  layerIndex.value = LAYER_LIST
}
//查看详细
const applicationDetail = (index) => {
  layerIndex.value = LAYER_DETAIL
  serverApplicationState.current = serverApplicationState.list[index]
  installStatus.value = getRefProgressValue(serverApplicationState.current.software)
}
initApplicationList();
listApplicationByType(-1, "已安装")
// initEvent()
</script>
<style lang="less">
@import "../assets/less/software.less";
</style>