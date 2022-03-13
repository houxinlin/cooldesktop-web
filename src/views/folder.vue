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
            <li @click="createFile('director')">创建文件夹</li>
            <li @click="createFile('file')">创建文件</li>
          </div>
          <div class="item-group">
            <li @click="filePaste()">粘贴</li>
          </div>
          <div class="item-group">
            <li @click="openFileAttribute(getCurrentDirectory())">属性</li>
          </div>
        </menu>
      </div>
      <div v-if="state.contextMenuVisible" :style="{
        left: state.contextMenuPoint.x + 'px',
        top: state.contextMenuPoint.y + 'px',
      }" class="file-menu">
        <menu>
          <div v-if="state.selectFileItem.type == 'folder'" class="item-group">
            <li @click="openNewFolderWhitThis()">在新窗口打开</li>
          </div>
          <div class="item-group">
            <li @click="deleteFile()">删除</li>
            <li @click="fileCopy()">复制</li>
            <li @click="fileCut()">剪切</li>
            <li @click="reName()">重复名</li>
          </div>
          <div class="item-group">
            <li @click="downloadCurSelectFile()">下载</li>
          </div>
          <div class="item-group">
            <li @click="fileCompress()">压缩</li>
            <li @click="fileDecompression()">解压</li>
          </div>
          <div class="item-group">
            <li @click="openFileAttribute()">属性</li>
          </div>
        </menu>
      </div>
    </template>
    <template v-slot:body>
      <div @dragstart="dragstart" @dragover="dragover" @dragleave="dragleave" @drop="drop" @contextmenu.prevent="folderContextMenu($event)" @click="
           state.contextMenuVisible = false;
           state.folderContextMenuVisible = false;
        " class="folder-global">
        <ul v-if="item.windowType == 'folder'">
          <template v-for="(item, index) in state.child" :key="item">
            <li @contextmenu.prevent="fileContextMenu($event, item)" :class="{ select: state.currentSelectName == item.name }" @click="
                state.currentSelectName = item.name;
                state.contextMenuVisible = false;
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
                <span v-if="item.edit == false">{{ item.name }}</span>
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
        </div>
      </header>

    </template>
  </BaseWindow>

</template>




<script setup>
const props = defineProps({
  item: Object,
  actionWindowId: String,
  folderInfo: Object,
});
import BaseWindow from "../components/window.vue";
//字符串常量
import * as string from "../global/strings.js";
import { defineProps, onMounted, reactive, ref, getCurrentInstance } from "vue";
//窗口操作
import { coolWindow, wact } from "../windows/window-manager.js";
//文件API
import * as folderApis from "../http/folder.js";
//文件上传组建
import { offerFile } from "../utils/upload/file-upload";
//用于判断有没有文件上传记录
import { uploads } from "../utils/upload/manager";
import { applicationState, getApplicationByMedia, } from "../global/application.js";
import { randId } from "../utils/utils.js"
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
let loadingWindows = new Map()

//显示文件上传管理器
const showUploadView = () => {
  coolWindow.openFileUploadManager();
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
    console.log(data, state.path.getPath());
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
const openFileAttribute = (defaultPath) => {
  let obj = getSelectFile() || { path: defaultPath };
  coolWindow.startNewFileAttribute(obj.path);
  hideAllPopupMenu();
};
//文件解压
const fileDecompression = () => {
  hideAllPopupMenu();
  folderApis.apiFileDecompression(getSelectFile().path).then((res) => { });
};
//文件压缩
const fileCompress = () => {
  hideAllPopupMenu();
  let file = getSelectFile();
  let name = "";

  //如果是文件
  if (file.isFile) {
    let index = file.name.indexOf(".");
    if (index == 0) {
      name = file.name;
    } else {
      name = file.name.substring(0, index);
    }
  } else {
    name = file.name;
  }
  coolWindow.startNewDialogSelect(name, function (data, dialog) {
    folderApis.apiFileCompress(getSelectFile().path, data.targetName, data.type).then((res) => {
      coolWindow.startNewSuccessMessageDialog("任务调用成功");
    });
  });
};
//隐藏所有弹出菜单
const hideAllPopupMenu = () => {
  state.folderContextMenuVisible = false;
  state.contextMenuVisible = false;
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
  loadingWindows.set(taskId, {
    "window": windowLoadingProperty, "doneFunction": () => {
      windowLoadingProperty.closeWindow()
      refresh();
    }
  })
  folderApis.apiFilePaste(state.path.getPath(), taskId).then((res) => {
    if (res.data.code != 0) {
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
  state.selectFileItem = item;
  state.folderContextMenuVisible = false;
  state.currentSelectName = item.name;
  state.contextMenuVisible = true;
  let window = document.getElementById(props.item.id);
  state.contextMenuPoint.x = e.x - window.offsetLeft;
  state.contextMenuPoint.y = e.y - window.offsetTop;
  e.preventDefault();
  e.stopPropagation();
};

const folderContextMenu = (e) => {
  state.currentSelectName = "";
  state.folderContextMenuVisible = true;
  state.contextMenuVisible = false;
  let window = document.getElementById(props.item.id);
  state.folderContextMenuPoint.x = e.x - window.offsetLeft;
  state.folderContextMenuPoint.y = e.y - window.offsetTop;
  e.preventDefault();
};

const listDirector = (path) => {
  folderApis.apiListDirectory(path).then((res) => {
    state.child = res.data.data;
    state.searchInputVisible = false;
    rawFils = state.child;
    for (const iterator of state.child) {
      iterator.edit = false;
    }
  });
};
//处理双击事件
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
  coolWindow.openNewFolder(getSelectFile().path);
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
    console.log(fileItem)

    offerFile(fileItem, inPath);
  }
};
const addDoneTask = (taskId, func) => {
  taskDoneExecuteMap.set(taskId, func)
}

const doHandlerTaskEvent = (data) => {
  if (data.action == "paste") {
    let fun = loadingWindows.get(data.id)["doneFunction"]
    if (data.result.code != 0) {
      coolWindow.startNewErrorMessageDialog(data.result.msg)
    }
    if (fun instanceof Function) { fun() }
  }
  if (data.action == "refresh") {
    refresh()
  }

}
const initEventListener = () => {
  proxy.eventBus.on("/event/file", (data) => { doHandlerTaskEvent(data) })

}
initEventListener();

onMounted(() => {
  listDirector(state.path.getPath());
});
</script>

<style lang="less">
</style>>
