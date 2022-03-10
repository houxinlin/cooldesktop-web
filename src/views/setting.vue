<template>
  <BaseWindow className="setting" :item="item">
    <template v-slot:body>
      <aside>
        <ul>
          <li @click="changeNavIndex(index)" v-for="(item,index) in nav" :class="[index==navIndex?'select':'']" :key="item">
            <div>
              <img :src="item.icon" alt="" srcset="">
              <span>{{item.name}}</span>
            </div>
          </li>
        </ul>
      </aside>
      <div class="setting-container">
        <div :style="[navIndex==0?'':'display:none']" class="page page-ssh">
          <div class="form-item">
            <span>用户名:</span>
            <input v-model="secureShellUser" type="text">
            <button class="save-user-button base-button" @click="apiConfigSecureShellUser">保存</button>
          </div>
          <div class="form-item">
            <div class="tip">
              <div>为了保证安全，系统将采用RSA认证，您只需要提供用户名即可，但这里我们不会过多传输您的用户名</div>
              <br>
              <div>点击下方重置按钮将自动生成公/私钥并保存至"authorized_keys"文件中</div>
            </div>
          </div>
          <div class="form-item">
            <button @click="configSecureShellClick" class="button base-button">重置</button>
          </div>
        </div>
        <div :style="[navIndex==1?'':'display:none']" class="page-background">
          <div class="perview">
            <img @click="selectBackground" :src="currentBackgroundImageUrl" alt="">
          </div>
        </div>
      </div>
    </template>
    <template v-slot:header>
      <header>设置</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
import { defineProps, onMounted, reactive, ref, toRef, toRefs, getCurrentInstance } from "vue";
import { selectFile } from "../utils/file.js"
import * as systemApi from "../http/system.js"
import { coolWindow } from "../windows/window-manager.js";
let secureShellUser = ref("")
let { proxy } = getCurrentInstance();
let currentBackgroundImageUrl = ref(`${new URL(`../assets/background/desktop.jpg`, import.meta.url).href}`)
const props = defineProps({
  item: Object,
  actionWindowId: String
});
const nav = [{
  "name": "SSH",
  "icon": new URL(`../assets/icon/ic-setting-shell.png`, import.meta.url).href,
}, {
  "name": "背景",
  "icon": new URL(`../assets/icon/ic-setting-computer.png`, import.meta.url).href,
},
{
  "name": "关于",
  "icon": new URL(`../assets/icon/ic-about.png`, import.meta.url).href,
},]
let navIndex = ref(0)

const showCurrentSystemWallpaper = () => {
  systemApi.apiGetSystemProperty().then((response) => {
    let wallpaper = response.data.data["wallpaper"]
    if (wallpaper != '') {
      wallpaper = wallpaper.substr(1)
      let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);
      let id = Math.round(Math.random() * 100)
      currentBackgroundImageUrl.value = `${serverDomain.value}${wallpaper}?id=${id}`
    }
  })

}
//选择壁纸
const selectBackground = () => {
  selectFile("image/*", false).then((imagefile) => {
    const formData = new FormData();
    formData.append("file", imagefile);
    //修改壁纸
    systemApi.apiChangeWallpaper(formData).then((response) => {
      showCurrentSystemWallpaper()
    })
  })

}
const apiConfigSecureShellUser = () => {
  let window = coolWindow.startNewLoadingView("保存中")
  systemApi.apiConfigSecureShellUser(secureShellUser.value).then((response) => {
    window.closeWindow()
    coolWindow.startNewSuccessMessageDialog(response.data.data)
  })
}
//配置系统ssh
const configSecureShellClick = () => {
  let window = coolWindow.startNewLoadingView("重置中")
  systemApi.apiConfigSecureShell().then((response) => {
    // if(response.)
    coolWindow.startNewSuccessMessageDialog(response.data.data)
  })
}
showCurrentSystemWallpaper()

const changeNavIndex = (index) => {
  navIndex.value = index
}
</script>

<style lang="less">
@import url("../assets/less/setting.less");
</style>