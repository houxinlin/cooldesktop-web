<template>
  <BaseWindow className="setting" :item="item">
    <template v-slot:body>
      <div class="left-tab-layout">
        <aside class="pos-fixed tbl0 ">
          <ul>
            <li @click="changeNavIndex(index)" v-for="(item,index) in NAV_LIST" :class="[index==navIndex?'select':'']" :key="item">
              <div>
                <img :src="item.icon" alt="" srcset="">
                <span>{{item.name}}</span>
              </div>
            </li>
          </ul>
        </aside>
        <div class="setting-container left-tab-layout-container">
          <div :style="[navIndex==0?'':'display:none']" class="page page-ssh">
            <div class="form-item">
              <span>用户名:</span>
              <input v-model="secureShellUser" type="text">
              <button class="save-user-button base-button green" @click="configSecureShellUser">保存</button>
            </div>
            <div class="form-item">
              <div class="tip">
                <div>系统将采用RSA认证，您只需要提供用户名即可，但这里我们不会过多传输您的用户名</div>
                <br>
                <div>点击下方重置按钮将自动生成公/私钥并保存至"authorized_keys"文件中，此后您将可以使用终端程序</div>
              </div>
            </div>
            <div class="form-item">
              <button @click="configSecureShell" class="button base-button green">重置</button>
            </div>
          </div>
          <div :style="[navIndex==1?'':'display:none']" class="page-background">
            <div class="perview">
              <img @click="selectBackground" :src="currentBackgroundImageUrl" alt="">
            </div>
          </div>
          <div :style="[navIndex==2?'':'display:none']" class="page-passwd flex flex-align-items-center">
            <span>新密码：</span>
            <input v-model="loginPasswd" type="password" class="base-input">
            <button @click="resetLoginPass" class="button color-white base-button red">重置</button>
          </div>
          <div :style="[navIndex==3?'':'display:none']" class="padding-10px page-url-config">
            <span>开放路径用于对外开放某个请求路径，使此地址不再受系统权限管理</span>
            <button @click="addOpenUrl" class="button color-white base-button green">增加</button>
            <ul>
              <template v-for="item in openUrlState.list" :key="item">
                <li class="margin-10px background-white-translucent padding-10px border-5-radius flex">
                  <div class="flex-1 font-size-10px">{{item}}</div>
                  <button @click="removeOpenUrl(item)" class="button color-white base-button red">删除</button>
                </li>

              </template>
            </ul>
          </div>
          <div :style="[navIndex==4?'':'display:none']" class="flex flex-align-items-center">
            <span>服务器地址：</span>
            <input v-model="softwareServerHost" class="base-input">
            <button @click="setSoftwareServerHost" class="button color-white base-button red">设置</button>

          </div>
          <div :style="[navIndex==5?'':'display:none']" class="page-about padding-10px">
            CoolDesktop({{version}})是一款服务器管理软件，提供强大的软件扩展能力，任何开发者都将可以自行开发管理软件并挂在到本系统上。
            <br>
            <br>
            详细请查看官方文档
            <br>
            <br>
            本系统还处于开发阶段，欢迎对本系统感兴趣并想参与他的开发的朋友加入。
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
import { defineProps, reactive, ref } from "vue";
import { selectFile } from "../utils/file.js";
import * as systemApi from "../http/system.js";
import { coolWindow } from "../windows/window-manager.js";
import { getSystemAddressByKey } from "../utils/utils.js";
import { notifyMessage } from "../utils/notify.js"
import md5 from "md5";
//ssh用户名
let secureShellUser = ref("");
//登录密码
let loginPasswd = ref("");
//软件服务器地址
let softwareServerHost = ref("");

let openUrlState = reactive({ list: [] });
//背景
let currentBackgroundImageUrl = ref(`${new URL(`../assets/background/desktop.jpg`, import.meta.url).href}`);
let version = ref("未获取到");
let COOLDESKTOP_PASS_SUFFIX = "cooldesktop@passwd!.";
const props = defineProps({
  item: Object,
  actionWindowId: String
});
//设置列表
const NAV_LIST = [{
  "name": "SSH",
  "icon": new URL(`../assets/icon/ic-setting-shell.png`, import.meta.url).href,
}, {
  "name": "背景",
  "icon": new URL(`../assets/icon/ic-setting-computer.png`, import.meta.url).href,
},
{
  "name": "登录密码",
  "icon": new URL(`../assets/icon/ic-passwd.png`, import.meta.url).href,
},
{
  "name": "开放路径",
  "icon": new URL(`../assets/icon/ic-setting-url.png`, import.meta.url).href,
},
{
  "name": "软件商店",
  "icon": new URL(`../assets/icon/ic-software.png`, import.meta.url).href,
},
{
  "name": "关于",
  "icon": new URL(`../assets/icon/ic-about.png`, import.meta.url).href,
},]
let navIndex = ref(0);

/**
 * 设置软件服务器地址
 */
const setSoftwareServerHost = () => {
  if (softwareServerHost.value == "") {
    notifyMessage("请填写服务器地址", "error");
    return
  }
  
  systemApi.apiSetSoftwareServerHost(softwareServerHost.value).then((response) => {
    notifyMessage(response.data.data, "success");
  })
}
/**
 * 重置登录密码
 */
const resetLoginPass = () => {
  let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,20}/
  if (reg.test(loginPasswd.value)) {
    let loadingWindow = coolWindow.startNewLoadingView("重置中");
    systemApi.apiResetLoginPasswd(md5(loginPasswd.value + COOLDESKTOP_PASS_SUFFIX)).then((response) => {
      loadingWindow.closeWindow();
      postMessage({ action: "notification", param: { message: response.data.data, type: "success" } });
    })
    return;
  }
  coolWindow.startNewErrorMessageDialog("你需要设置至少包含一个大写字母、一个小写字母、一个数字、一个特殊符号的6-20位密码");

}
/**
 * 显示所有配置
 */

const showAllConfig = () => {
  systemApi.apiGetCoolDesktopConfigs().then((response) => {
    let wallpaper = response.data.data["wallpaper"];
    version.value = response.data.data["cooldesktop.version"];
    softwareServerHost.value = response.data.data["application_server_host"];
    if (wallpaper != undefined && wallpaper != '') {
      wallpaper = wallpaper.substr(1);
      let serverDomain = ref(getSystemAddressByKey("host"));
      currentBackgroundImageUrl.value = `${serverDomain.value}${wallpaper}`;
    }
  })

}
/**
 * 选择壁纸
 */
const selectBackground = () => {
  selectFile("image/*", false).then((imagefile) => {
    const formData = new FormData();
    formData.append("file", imagefile);
    //修改壁纸
    let loading = coolWindow.startNewLoadingView("上传中...");

    systemApi.apiChangeWallpaper(formData).then((response) => {
      showaseConfig();
      loading.closeWindow();
    })
  })

}
/**
 * 设置ssh用户名
 */
const configSecureShellUser = () => {
  let window = coolWindow.startNewLoadingView("保存中");
  systemApi.apiConfigSecureShellUser(secureShellUser.value).then((response) => {
    window.closeWindow();
    notifyMessage(response.data.data, "success");
  })
}
/**
 * 配置系统ssh
 */
const configSecureShell = () => {
  let window = coolWindow.startNewLoadingView("重置中");
  systemApi.apiConfigSecureShell().then((response) => {
    window.closeWindow();
    coolWindow.startNewSuccessMessageDialog(response.data.data);
  })
}
/**
 * 添加系统url
 */
const addOpenUrl = () => {
  coolWindow.startNewDialogCreateFile((data) => {
    if ((data.targetName || "").length == 0) {
      coolWindow.startNewErrorMessageDialog("参数不能为空");
      return;
    }
    systemApi.apiAddOpenUrl(data.targetName).then((response) => {
      if (response.data.status < 0) {
        coolWindow.startNewErrorMessageDialog(response.data.msg);
      }
      showAllOpenUrl();
    })
  })
}
/**
 * 删除系统开放url
 */
const removeOpenUrl = (url) => {
  systemApi.apiRemoveOpenUrl(url).then((response) => {
    coolWindow.startNewSuccessMessageDialog(response.data.msg);
    showAllOpenUrl();
  })
}

/**
 * 显示所有url
 */
const showAllOpenUrl = () => {
  systemApi.apiGetOpenUrl().then((response) => {
    openUrlState.list = response.data.data;
  })
}
showAllConfig();
showAllOpenUrl();

const changeNavIndex = (index) => {
  navIndex.value = index;
}
</script>

<style lang="less">
@import url("../assets/less/setting.less");
</style>