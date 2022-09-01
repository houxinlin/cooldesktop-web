<template>
  <BaseWindow :item="item" className="share-link-list">
    <template v-slot:body>
      <div class="datas  color-white">
        <div class="list-container">
          <div class="table-layout">
            <!-- 头部 -->
            <header>
              <ul>
                <li>id</li>
                <li style="flex:2">路径</li>
                <li>过期时间</li>
                <li>操作</li>
              </ul>
            </header>
            <ul class="table-body">
              <!-- 数据列表 -->
              <template v-for="(item,index) in shareLink.list" :key="index">
                <li class="flex-aling-item-center">
                  <span>{{item.shareId}}</span>
                  <span style="flex:2">{{item.filePath}}</span>
                  <span>{{item.expireTime}}</span>
                  <span>
                    <button @click="deleteShareLink(item)" class="base-button red color-white">删除</button>
                    <button style="margin-left:2px" @click="copyShareLink(item)" class="base-button green color-white">复制</button>
                  </span>

                </li>
              </template>

            </ul>
          </div>
        </div>
      </div>

    </template>
    <template v-slot:header>
      <header>共享链接</header>
    </template>
  </BaseWindow>
</template>

<script setup>
import BaseWindow from "../components/window.vue";
import { ref, reactive } from "vue";
import { copyTextToClipboard } from "../utils/utils.js";
import { apiListShareLink, apiDeleteShareLink } from "../http/folder.js";

let shareLink = reactive({ list: [] })
/**
 * 获取共享链接数据
 */
const listShareLink = () => {
  apiListShareLink().then((response) => {
    shareLink.list = response.data.data
  })
}

/**
 * 删除共享链接数据
 */
const deleteShareLink = (item) => {
  apiDeleteShareLink(item.shareId).then((response) => {
    listShareLink();
  })
}
/**
 * 复制共享链接地址
 */
const copyShareLink = (item) => {
  let data = `${import.meta.env.VITE_APP_REQUEST_URL}s/${item.shareId}`;
  copyTextToClipboard(data);
}
listShareLink();
</script>

<style lang="less">
</style>