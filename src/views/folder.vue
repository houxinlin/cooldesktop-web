<template>
  <BaseWindow :item="item" className="folder">
    <template v-slot:extend>
      <div v-if="state.folderContextMenuVisible" :style="{
        left: state.folderContextMenuPoint.x + 'px',
        top: state.folderContextMenuPoint.y + 'px',
      }" class="file-menu">
        <menu>
          <div class="item-group">
            <li @click="openTerminal()">在此处打开终端</li>
          </div>
          <div class="item-group">
            <li @click="createFile('folder')">创建文件夹</li>
            <li @click="createFile('file')">创建文件</li>
          </div>
          <div class="item-group">
            <li @click="filePaste()">粘贴</li>
          </div>
          <div class="item-group">
            <li @click="openFileAttribute(getCurrentDirectory())">属性</li>
            <li @click="copyFilePath(getCurrentDirectory())">复制文件路径</li>
          </div>
          <div class="item-group">
            <li @click="sendToDesktop(getSelectFile().path)">发送到桌面</li>
          </div>
        </menu>
      </div>
      <div v-if="state.contextMenuVisible" :style="{
        left: state.contextMenuPoint.x + 'px',
        top: state.contextMenuPoint.y + 'px',
      }" class="file-menu">
        <menu>
          <div v-if="state.selectFileItem.type != 'folder'" class="item-group">
            <li @click="showOpenMethod()">打开方式</li>
          </div>
          <div v-if="state.selectFileItem.type == 'folder'" class="item-group">
            <li @click="openNewFolderWhitThis()">在新窗口打开</li>
          </div>
          <div class="item-group">
            <li @click="deleteFile()">删除</li>
            <li @click="fileCopy()">复制</li>
            <li @click="fileCut()">剪切</li>
            <li @click="reName()">重命名</li>
          </div>
          <div v-if="state.selectFileItem.type != 'folder'" class="item-group">
            <li @click="downloadCurSelectFile()">下载</li>
          </div>
          <div class="item-group">
            <li @click="fileCompress()">压缩</li>
            <li @click="fileDecompression()">解压</li>
          </div>
          <div class="item-group">
            <li @click="openFileAttribute(getSelectFile().path)">属性</li>
            <li @click="copyFilePath(getSelectFile().path)">复制文件路径</li>
          </div>
          <div class="item-group">
            <li @click="sendToDesktop(getSelectFile().path)">发送到桌面</li>
          </div>
          <div v-if="state.selectFileItem.rawType=='jar'" class="item-group mulit">
            <li>
              <span>jar</span>
              <menu class="second-menu">
            <li @click="runJar(getSelectFile().path)">运行</li>
            <li @click="stopJar(getSelectFile().path)">停止</li>
        </menu>
        </li>
      </div>
      <div v-if="state.selectFileItem.rawType=='sh'" class="item-group mulit">
        <li>
          <span>sh</span>
          <menu class="second-menu">
        <li @click="runShell(getSelectFile().path)">运行</li>
        </menu>
        </li>
      </div>
      </menu>
      </div>
    </template>
    <template v-slot:body>
      <div v-if="selectOpenMethod" class="select-method-mask pos-absolute fit-parent"></div>
      <div v-if="selectOpenMethod" class="select-method pos-absolute flex flex-all-center fit-parent">
        <div class="height-200px flex flex-column background-white ">
          <header class="grid">
            <button @click="selectOpenMethod=false" class="base-button">取消</button>
            <div class="title flex flex-all-center">请选择打开方式</div>
            <div></div>
          </header>
          <ul class="padding-10px flex-1">
            <template v-for="applicationItem in applicationState.applications" :key="applicationItem.applicationId">
              <li @click="openByApplicationId(applicationItem)" class="cursor-pointer margin-b-5px">
                <div class="flex flex-aling-item-center">
                  <img class="wh-30px" :src=" serverDomain + 'desktop/webapplication/' + applicationItem.applicationId + '/logo.png'" alt="" />
                  <span class="font-size-10px">{{applicationItem.applicationName}}</span>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div @dragstart="dragstart" @dragover="dragover" @dragleave="dragleave" @drop="drop" @contextmenu.prevent="folderContextMenu($event)" @click="
           hideAllPopupMenu()
        " class="folder-global">
        <div v-if="loadingVisable" class="loading pos-absolute flex pos-ltrb0 flex-all-center">
          <img class="wh-40px" src="../assets/icon/ic-loading.png" alt="">
        </div>
        <ul class="folder-u" v-if="item.windowType == 'folder'">
          <template v-for="(item, index) in state.child" :key="item">
            <li @contextmenu.prevent="fileContextMenu($event, item)" :class="{ select: state.currentSelectName == item.name }" @click="
                state.currentSelectName = item.name;
                state.contextMenuVisible = false;
                state.selectFileItem=item
              " @dblclick="fileDblClick(item)">
              <div class="file-item">
                <img v-if="item.type != 'image'" :src="
                    serverDomain +
                    'desktop/api/file/getFileIconByType?type=' +
                    item.rawType
                  " />
                <img v-if="item.type == 'image'" :src="
                    serverDomain +
                    'desktop/api/file/getImageThumbnail?path=' +
                    encodeURIComponent(item.path)
                  " alt="" />
                <span @keydown="fileKeyDown($event, index)" @blur="fileBlur(index)" class="contenteditable" v-if="item.edit" contenteditable="true">{{ item.name }}</span>
                <span class="file-name" v-if="item.edit == false">{{ item.name }}</span>
                <div class="tip">{{ item.name }}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>

    </template>
    <template v-slot:header>
      <header>
        <ul>
          <template v-for="(item, index) in state.path.pathBlock" :key="item">
            <li @click="navPathClick(index)">{{ item }}</li>
          </template>
        </ul>

        <div class="infos">
          <div class="search">
            <input id="searchInput" :class="{ open: state.searchInputVisible }" placeholder="请输入搜索字符" v-model="fileSearchValue" @input="fileSearchInputEvent" class="base-input close" type="text" />
            <img @click="showSearchInput()" src="../assets/icon/ic-search.png" alt="" />
          </div>
          <div v-if="uploads.files.length > 0" @click.stop="showUploadView()" class="loader"></div>
          <button @click="callbackSelect" v-if="props.item.isSelect==true" class="base-button green">选择</button>

        </div>
      </header>

    </template>
  </BaseWindow>

</template>


<script setup>
const props = defineProps({
  item: Object,
  actionWindowId: String
});

import { copyText } from 'vue3-clipboard'



import VueClipboard from 'vue3-clipboard'
import BaseWindow from "../components/window.vue";
//字符串常量
import * as string from "../global/strings.js";
import { defineProps, onMounted, reactive, ref, getCurrentInstance } from "vue";
//窗口操作
import { coolWindow, wact } from "../windows/window-manager.js";
//文件API
import * as folderApis from "../http/folder.js";
import * as sysApis from "../http/system.js";
//文件上传组建
import { offerFile } from "../utils/upload/file-upload";
//用于判断有没有文件上传记录
import { uploads } from "../utils/upload/manager";
import { applicationState, getApplicationByMedia } from "../global/application.js";
import { randId } from "../utils/utils.js"
const message = ref("false")
let loadingVisable = ref(false)
//传递过来的数据
let state = reactive({ ...props.item.data });
//服务器域名
let serverDomain = ref(import.meta.env.VITE_APP_REQUEST_URL);
//文件搜索值
let fileSearchValue = ref("");
//原始文件列表，搜索的时候这里保存原来记录
let rawFils = [];
//这里主要用于eventbus
let { proxy } = getCurrentInstance();
//任务完成后会掉
let taskDoneExecuteMap = new Map()
//文件粘贴标识
let doneCallback = new Map()

let selectOpenMethod = ref(false)
const copyFilePath = (text) => {
  copyText(text, undefined, (error, event) => { })
  hideAllPopupMenu()
}
const sendToDesktop = (path) => {
  hideAllPopupMenu()
  sysApis.apiAddDesktopFile(path).then((Response) => { })
}
const runShell = (path) => {
  hideAllPopupMenu()
  folderApis.apiRunShell(path).then((e) => {

  })
}
const runJar = (path) => {
  hideAllPopupMenu()

  sysApis.apiGetSysProperty(`jar_arg_${path}`).then((response) => {
    console.log(response);
    coolWindow.startNewInputDialog((value) => {
      let loading = coolWindow.startNewLoadingView("启动中")
      sysApis.apiSetSysProperty(`jar_arg_${path}`, value.targetName).then((setPropertyResponse) => {

      })
      folderApis.apiRunJar(path, value.targetName).then((e) => {
        coolWindow.startNewSuccessMessageDialog(e.data.data == true ? "启动成功" : "启动失败")
        loading.closeWindow()
      })
    }, "填写启动参数", response.data.data)
  })
}
const stopJar = (path) => {
  let loading = coolWindow.startNewLoadingView("停止中")
  folderApis.apiStopJar(path).then((e) => {
    coolWindow.startNewSuccessMessageDialog(e.data.data)
    loading.closeWindow()
  })
  hideAllPopupMenu()
}
const openByApplicationId = (application) => {
  selectOpenMethod.value = false
  let file = getSelectFile()
  coolWindow.startNewWebView(application, `path=${file.path}`)

}
const callbackSelect = () => {
  if (getSelectFile() == null) return
  if (props.item.selectType == "file" && getSelectFile().type == "folder") return
  if (props.item.selectType == "folder" && getSelectFile().type != "folder") return
  if (props.item.selectCallback != undefined) {
    props.item.selectCallback(getSelectFile())
    wact.closeWindow(props.item.id)
    return
  }
}
const showOpenMethod = () => {
  hideAllPopupMenu()
  selectOpenMethod.value = true
}
//显示文件上传管理器
const showUploadView = () => {
  coolWindow.startFileUploadManager();
};
//打开终端
const openTerminal = () => {
  hideAllPopupMenu();
  coolWindow.startNewTerminal(getCurrentDirectory());
};
//显示文件搜索框
const showSearchInput = () => {
  state.searchInputVisible = !state.searchInputVisible;
  document.querySelector(`#${props.item.id} #searchInput`).focus();
};
//文件搜索
const fileSearchInputEvent = (e) => {
  let value = fileSearchValue.value;
  state.child = rawFils.filter((e) => { return e.name.startsWith(value) });
};
//获取当前目录
const getCurrentDirectory = () => {
  return state.path.getPath();
};
//下载当前选中的文件
const downloadCurSelectFile = () => {
  hideAllPopupMenu();
  var link = document.createElement("a");
  link.download;
  link.style.display = "none";
  link.href = serverDomain.value + `desktop/api/file/download?path=${getSelectFile().path}`;
  document.body.appendChild(link);
  link.click();
};
//创建文件
const createFile = (type) => {
  hideAllPopupMenu();
  coolWindow.startNewDialogCreateFile((data) => {
    folderApis
      .apiCreateFile(getCurrentDirectory(), data.targetName, type)
      .then((res) => {
        if (res.data.status != 0) {
          coolWindow.startNewErrorMessageDialog(res.data.msg);
        }
        refresh();
      });
  });
};
//打开文件属性
const openFileAttribute = (filePath) => {
  coolWindow.startNewFileAttribute(filePath);
  hideAllPopupMenu();
};
//文件解压
const fileDecompression = () => {
  hideAllPopupMenu();
  let loading = coolWindow.startNewLoadingView("解压中")
  let taskId = randId()
  addDoneTask(taskId, () => {
    loading.closeWindow()
    refresh()
  })
  folderApis.apiFileDecompression(getSelectFile().path, taskId).then((res) => { });
};
//文件压缩
const fileCompress = () => {
  hideAllPopupMenu();
  let file = getSelectFile();
  let name = "";

  //如果是文件
  if (file.isFile) {
    let index = file.name.indexOf(".");
    if (index == -1) {
      name = file.name;
    } else {
      name = file.name.substring(0, index);
    }
  } else {
    name = file.name;
  }

  //选择压缩类型
  coolWindow.startNewCompressDialogSelect(name, function (data, dialog) {
    //压缩
    let loading = coolWindow.startNewLoadingView("压缩中")
    let taskId = randId()
    addDoneTask(taskId, () => {
      loading.closeWindow()
      refresh()
    })
    folderApis.apiFileCompress(getSelectFile().path, data.targetName, data.type, taskId).then((res) => {

    });
  });
};
//隐藏所有弹出菜单
const hideAllPopupMenu = () => {
  state.folderContextMenuVisible = false;
  state.contextMenuVisible = false;
  props.item.canResize = true
};
//文件复制
const fileCopy = () => {
  hideAllPopupMenu();
  folderApis.apiFileCopy(getSelectFile().path).then((res) => { });
};
//文件粘贴
const filePaste = () => {
  hideAllPopupMenu();
  let windowLoadingProperty = coolWindow.startNewLoadingView("文件复制中...")
  let taskId = randId()
  //由于不知道什么时候复制完成，先将完成后的事情做个回调
  //服务器会返回一个id，当文件处理完成后，会回调这个id
  //文件处理完成后会回调到doneFunction
  addDoneTask(taskId, () => {
    windowLoadingProperty.closeWindow()
    refresh();
  })
  folderApis.apiFilePaste(state.path.getPath(), taskId).then((res) => {
    if (res.data.status != 0) {
      coolWindow.startNewErrorMessageDialog(res.data.msg);
    }

  }).catch((e) => { });
};
//文件剪切
const fileCut = () => {
  folderApis.apiFileCut(getSelectFile().path).then((res) => { });
  hideAllPopupMenu();
};

const selectText = (element) => {
  var text = document.querySelector(element);
  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const fileKeyDown = (events, index) => {
  if (events.keyCode == 13) {
    let span = document.querySelector(
      `.window-body ul li:nth-child(${index + 1}) span`
    );
    folderApis
      .apiFileRename(state.child[index].path, span.textContent)
      .then((res) => {
        refresh();
        if (res.data.status != 0) {
          coolWindow.startNewErrorMessageDialog(res.data.msg);
        }
      });
    events.preventDefault();
    events.stopPropagation();
  }
};
const fileBlur = (index) => {
  state.child[index].edit = false;
};
const reName = () => {
  let select = getSelectFile();
  let index = state.child.findIndex((r) => {
    return r == select;
  });

  setTimeout(function () {
    document
      .querySelector(`.window-body ul li:nth-child(${index + 1}) span`)
      .focus();
    selectText(`.window-body ul li:nth-child(${index + 1}) span`);
  }, 0);
  state.child[index].edit = true;
  hideAllPopupMenu();
};
const fileContextMenu = (e, item) => {
  e.preventDefault();
  e.stopPropagation();
  props.item.canResize = false
  state.selectFileItem = item;
  state.folderContextMenuVisible = false;
  state.currentSelectName = item.name;
  state.contextMenuVisible = true;
  let window = document.getElementById(props.item.id);
  state.contextMenuPoint.x = e.x - window.offsetLeft;
  state.contextMenuPoint.y = e.y - window.offsetTop;

};

const folderContextMenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  props.item.canResize = false
  state.currentSelectName = "";
  state.folderContextMenuVisible = true;
  state.contextMenuVisible = false;
  let window = document.getElementById(props.item.id);
  state.folderContextMenuPoint.x = (e.x) - (window.offsetLeft);
  state.folderContextMenuPoint.y = (e.y) - (window.offsetTop);

};

const listDirector = (path) => {
  loadingVisable.value = true
  state.child.length = 0
  folderApis.apiListDirectory(path).then((res) => {
    loadingVisable.value = false
    state.child = res.data.data;
    state.searchInputVisible = false;
    rawFils = state.child;
    for (const iterator of state.child) {
      iterator.edit = false;
    }
  });
};
//处理文件双击事件
const doHandlerFileDblClick = (item) => {
  //不知道文件类型
  if (item.type == "none") {
    postMessage({ action: "notification", param: { message: string.CANTHANDLE_FILE_TYPE, type: "error" } });
    return;
  }
  //查找能处理这个应用的app
  let handlerApp = getApplicationByMedia(item.type)[0];
  if (handlerApp == undefined) {
    //没有找到
    postMessage({ action: "notification", param: { message: string.NOTFOUND_APPLICATION, type: "error" } });
    return;
  }
  //打开首页

  coolWindow.startNewWebView(handlerApp, `path=${item.path}`)
};
//文件双击
const fileDblClick = (item) => {
  //不是文件夹
  if (item.type != "folder") {
    doHandlerFileDblClick(item);
    return;
  }

  state.child.length = 0;
  state.contextMenuVisible = false;
  state.path.append(item.name);
  listDirector(state.path.getPath());
};
const navPathClick = (index) => {
  state.path.range(index);
  state.contextMenuVisible = false;
  listDirector(state.path.getPath());
  hideAllPopupMenu();
};
const getSelectFile = () => {
  return state.selectFileItem;
};
const openNewFolderWhitThis = () => {
  state.contextMenuVisible = false;
  if (getSelectFile().type != "folder") {
    return;
  }
  hideAllPopupMenu();
  coolWindow.startNewFolder(getSelectFile().path);
};
//刷新
const refresh = () => {
  hideAllPopupMenu();
  listDirector(state.path.getPath());
};
//删除文件
const deleteFile = () => {
  state.contextMenuVisible = false;
  folderApis.apiDeleteFileOrFolder(getSelectFile().path).then((res) => {
    if (res.data.status == 0) {
      refresh();
      return;
    }
    coolWindow.startNewErrorMessageDialog(res.data.msg);
  });
};
const dragstart = (event) => {
  event.dataTransfer.effectAllowed = "all";
  event.dataTransfer.dropEffect = "move"
}
const dragover = (event) => {
  event.preventDefault();
};
const dragleave = (event) => {
};

const drop = (event) => {
  event.preventDefault();
  let files = event.dataTransfer.files;
  let inPath = state.path.path;
  for (let index = 0; index < files.length; index++) {
    const fileItem = files[index];
    offerFile(fileItem, inPath);
  }
};
const addDoneTask = (taskId, func) => {
  doneCallback.set(taskId, { "doneFunction": func })
}

const doHandlerTaskEvent = (data) => {
  if (data.action == "refresh") {
    refresh()
    return
  }
  let taskInfo = doneCallback.get(data.id)
  if (taskInfo != null) {
    let fun = taskInfo.doneFunction
    if (fun instanceof Function) { fun() }
  }
}

let webSocketEventHandlerFunction = (data) => { doHandlerTaskEvent(data) }
const initEventListener = () => {
  proxy.eventBus.on("/event/file", webSocketEventHandlerFunction)
  proxy.eventBus.on("/event/compress/result", webSocketEventHandlerFunction)
}
props.item.events = function (e, d) {
  if (e == "close") {
    proxy.eventBus.off("/event/file", webSocketEventHandlerFunction)
    proxy.eventBus.off("/event/compress/result", webSocketEventHandlerFunction)
  }
};

onMounted(() => {
  initEventListener();
  listDirector(state.path.getPath());

});
</script>

<style lang="less">
</style>>
