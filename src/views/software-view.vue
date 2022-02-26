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
      <div class="window-title base-title">
        <header></header>
        <div class="opt">
          <i class="iconfont icon-tzuixiaohua" @click="wact.windowMin(item.id)"></i>
          <i class="iconfont icon-big" @click="wact.windowFullScreen(item.id)"></i>
          <i class="iconfont icon-webicon309" @click="wact.closeWindow(item.id)"></i>
        </div>
      </div>
      <div class=" window-body">

        <aside>
          <ul>
            <li class="select">文本处理</li>
            <li>图像处理</li>
          </ul>
        </aside>
        <div class="container">
          <div class="app-install-container">
            <div class="header-info">
              <div class="logo">
                <img src="../assets/icon/ic-upload-manager.png" />
                <button>安装</button>
              </div>
              <div class="introduce">
                <div class="introduce-item">
                  <span class="key">名称:</span>
                  <span class="value">文本查看器</span>
                </div>
                <div class="introduce-item">
                  <span class="key">大小:</span>
                  <span class="value">文本查看器</span>
                </div>
                <div class="introduce-item">
                  <span class="key">作者:</span>
                  <span class="value">文本查看器</span>
                </div>
                <div class="introduce-item">
                  <span class="key">简介:</span>
                  <span class="value">文本查看器</span>
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
          <div style="display:none" class="app-list-container">
            <ul>
              <li class="app-item">
                <div class="file-item">
                  <img src="../assets/icon/ic-upload-manager.png" />
                  <span>文本查看器</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, reactive, ref, toRef, toRefs } from "vue";
import { coolWindow, wact } from "../windows/window-manager.js";



const props = defineProps({
  item: Object,
  actionWindowId: String,
});



let state = reactive({ ...props.item.data });

</script>

<style lang="less">
@import "../assets/less/software.less";
</style>