<template>
  <div
    :id="item.id"
    :data-id="item.id"
    :class="{
      'min-window': item.minState,
      'max-window': item.maxState,
      'window-item-resize': item.canResize,
      'action-window-border': item.actionWindow,
      'hide-window': item.hideWindow,
      'close-window-transition': item.closeWindowTransition,
      'window-transition': item.windowTransition,
      'window-scale': item.windowScale,

      'window-z-height': item.actionWindow,
      folder: item.windowType == 'folder',
    }"
    class="window-item"
    @mousedown="wact.windowMove"
    @mouseup="wact.windowMouseUp"
  >
    <div
      v-if="state.folderContextMenuVisible"
      :style="{
        left: state.folderContextMenuPoint.x + 'px',
        top: state.folderContextMenuPoint.y + 'px',
      }"
      class="file-menu"
    >
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
    <div
      v-if="state.contextMenuVisible"
      :style="{
        left: state.contextMenuPoint.x + 'px',
        top: state.contextMenuPoint.y + 'px',
      }"
      class="file-menu"
    >
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
          <li>下载</li>
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
    <!-- <div
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
      @click="wact.setWindowPos(item.id)"
      :class="{ action: actionWindowId == item.id }"
      class="window-mask"
    ></div> -->
    <div class="window-content">
      <div class="window-title">
        <header>
          <ul>
            <template v-for="(item, index) in state.path.pathBlock" :key="item">
              <li @click="navPathClick(index)">{{ item }}</li>
            </template>
          </ul>

          <div class="infos">
            <div class="search">
              <input
                id="searchInput"
                :class="{ open: state.searchInputVisible }"
                placeholder="请输入搜索字符"
                v-model="fileSearchValue"
                @input="fileSearchEvent"
                class="base-input close"
                type="text"
              />
              <img
                @click="showSearchInput()"
                src="../assets/icon/ic-search.png"
                alt=""
              />
            </div>
            <div
              v-if="uploads.files.length > 0"
              @click.stop="showUploadView()"
              class="loader"
            ></div>
          </div>
        </header>
        <div class="opt">
          <i
            class="iconfont icon-tzuixiaohua"
            @click="wact.windowMin(item.id)"
          ></i>
          <i
            class="iconfont icon-big"
            @click="wact.windowFullScreen(item.id)"
          ></i>
          <i
            class="iconfont icon-webicon309"
            @click="wact.closeWindow(item.id)"
          ></i>
        </div>
      </div>
      <div
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
        @contextmenu.prevent="folderContextMenu($event)"
        @click="
          state.contextMenuVisible = false;
          state.folderContextMenuVisible = false;
        "
        class="window-body"
      >
        <ul v-if="item.windowType == 'folder'">
          <template v-for="(item, index) in state.child" :key="item">
            <li
              @contextmenu.prevent="fileContextMenu($event, item)"
              :class="{ select: state.currentSelectName == item.name }"
              @click="
                state.currentSelectName = item.name;
                state.contextMenuVisible = false;
              "
              @dblclick="fileDblClick(item)"
            >
              <div class="file-item">
                <img
                  v-if="item.type != 'img'"
                  :src="
                    request +
                    'desktop/api/file/getFileIconByType?type=' +
                    item.type
                  "
                  alt=""
                />
                <img
                  v-if="item.type == 'img'"
                  :src="
                    request +
                    'desktop/api/file/getImageThumbnail?path=' +
                    encodeURIComponent(item.path)
                  "
                  alt=""
                />
                <span
                  @keydown="fileKeyDown($event, index)"
                  @blur="fileBlur(index)"
                  class="contenteditable"
                  v-if="item.edit"
                  contenteditable="true"
                  >{{ item.name }}</span
                >
                <span v-if="item.edit == false">{{ item.name }}</span>
                <div class="tip">{{ item.name }}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object,
  actionWindowId: String,
  folderInfo: Object,
});
import elementResizeDetectorMaker from "element-resize-detector";
import { defineProps, onMounted, reactive, ref } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";
import * as folderApis from "../http/folder.js";
import { FileUpload } from "../utils/upload/file-upload";
import { uploads } from "../utils/upload/manager";
import {
  applicationState,
  getApplicationByMedia,
} from "../global/application.js";

let state = reactive({ ...props.item.data });
let request = ref(import.meta.env.VITE_APP_REQUEST_URL);
let fileSearchValue = ref("");
let rawFils = [];

const showUploadView = () => {
  coolWindow.openFileUploadManager();
};

const openTerminal = () => {
  hideMenu();
  coolWindow.startNewTerminal(getCurrentDirectory());
};
const showSearchInput = () => {
  state.searchInputVisible = !state.searchInputVisible;
  document.querySelector(`#${props.item.id} #searchInput`).focus();
};
const fileSearchEvent = (e) => {
  let value = fileSearchValue.value;
  state.child = rawFils.filter((e) => {
    return e.name.startsWith(value);
  });
};
const getCurrentDirectory = () => {
  return state.path.getPath();
};
const createFile = (type) => {
  hideMenu();
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
const openFileAttribute = (defaultPath) => {
  let obj = getSelectFile() || { path: defaultPath };
  coolWindow.startNewFileAttribute(obj.path);
  hideMenu();
};
const fileDecompression = () => {
  hideMenu();
  folderApis.apiFileDecompression(getSelectFile().path).then((res) => {});
};
const fileCompress = () => {
  hideMenu();
  let file = getSelectFile();
  let name = "";

  if (!file.baseFileAttribute.directory) {
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
    folderApis
      .apiFileCompress(getSelectFile().path, data.targetName, data.type)
      .then((res) => {
        coolWindow.startNewSuccessMessageDialog("任务调用成功");
      });
  });
};
const hideMenu = () => {
  state.folderContextMenuVisible = false;
  state.contextMenuVisible = false;
};
const fileCopy = () => {
  folderApis.apiFileCopy(getSelectFile().path).then((res) => {});
  hideMenu();
};
const filePaste = () => {
  folderApis.apiFilePaste(state.path.getPath()).then((res) => {
    if (res.data.status != 0) {
      coolWindow.startNewErrorMessageDialog(res.data.msg);
    }
    refresh();
  });
  hideMenu();
};
const fileCut = () => {
  folderApis.apiFileCut(getSelectFile().path).then((res) => {});
  hideMenu();
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
  hideMenu();
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
/**
 * 文件夹右击
 */
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

const handlerFileDblClick = (item) => {
  let handlerApp = getApplicationByMedia("text")[0];
  let url = request.value+"desktop/webapplication/" + handlerApp.applicationId + "/index.html?path="+item.path;
  coolWindow.startNewWebView(url,"text-editor",handlerApp);
};
const fileDblClick = (item) => {
  if (item.type != "folder") {
    handlerFileDblClick(item);
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
  hideMenu();
};
const getSelectFile = () => {
  return state.selectFileItem;
};
const openNewFolderWhitThis = () => {
  state.contextMenuVisible = false;
  if (getSelectFile().type != "folder") {
    return;
  }
  hideMenu();
  coolWindow.openNewFolder(getSelectFile().path);
};
const refresh = () => {
  hideMenu();
  listDirector(state.path.getPath());
};
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
const dragover = (event) => {
  console.log("enter");
  event.preventDefault();
};
const dragleave = (event) => {
  console.log("leaver");
};
function spArr(arr, num) {
  let newArr = [];
  for (let i = 0; i < arr.length; ) {
    newArr.push(arr.slice(i, (i += num)));
  }
  return newArr;
}
const drop = (event) => {
  event.preventDefault();
  let files = event.dataTransfer.files;
  let inPath = state.path.path;
  let upload = new FileUpload();
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    upload.start(element, inPath, (res) => {
      if (res.data.status == 0) {
        coolWindow.startNewSuccessMessageDialog("上传成功");
      }
      if (res.data.status != 0) {
        coolWindow.startNewErrorMessageDialog(res.data.msg);
      }
    });
  }
};
onMounted(() => {
  listDirector(state.path.getPath());
});
</script>

<style lang="less">
@import "../assets/less/loading.less";
</style>>
