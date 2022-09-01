<template>
  <BaseWindow :item="item" className="share-link-day-select" backgroundClass="window-body-background-red">
    <template v-slot:body>
      <div class="color-white padding-10px container">
        <div class="item flex flex-align-items-center info-form-item">
          <span class="key">有效期:</span>
          <div class="value">
            <div class="cooldesktop-select-container">
              <div @click="openSelectList" class="selected">{{dayValue}}</div>
              <ul v-if="showSelectList" class="cooldesktop-select-ul">
                <template v-for="item in DAY_VALUE">
                  <li @click="selectItem(item)">{{item}}</li>
                </template>
              </ul>
            </div>
          </div>
        </div>
        <div class="btn">
          <button @click="share" class="color-white base-button white-translucent">分享</button>
        </div>
      </div>
    </template>
    <template v-slot:header>
      <header>选择有效期</header>
    </template>
  </BaseWindow>

</template>


<script setup>
import { defineProps, ref } from "vue";

import BaseWindow from "../../components/window.vue";
const props = defineProps({
  item: Object,
  actionWindowId: String,
});

const DAY_VALUE = ["1天", "7天", "永久"];
let showSelectList = ref(false);
let dayValue = ref(DAY_VALUE[0]);
const openSelectList = () => {
  showSelectList.value = true;
}
/**
 * select框选择
 */
const selectItem = (value) => {
  dayValue.value = value;
  showSelectList.value = false;
}
/**
 * 回调给调用方并关闭本窗口
 */
const share = () => {
  props.item.data.callback(dayValue.value);
  props.item.closeWindow();
}

</script>

<style lang="less" >
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .btn {
    display: flex;
    justify-content: end;
  }
}
</style>