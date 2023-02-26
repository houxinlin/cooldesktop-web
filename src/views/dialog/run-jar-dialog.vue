<template>
    <BaseWindow :item="item" class="input-dialog" className="run-jar-dialog" backgroundClass="window-body-background-green">
        <template v-slot:body>
            <div class="item">
                <header>JVM参数</header>
                <textarea class="base-input" v-model="jvmArg" type="text" />
            </div>

            <div class="item">
                <header>应用程序参数</header>
                <textarea class="base-input" v-model="applicationArg" type="text" />
            </div>

            <div class="item">
                <header>日志输出路径</header>
                <input class="base-input" v-model="logPath" type="text" />
            </div>
            <button class="base-button color-white red-a" @click="finish()">确定</button>
        </template>
        <template v-slot:header>
            <header>{{ props.item.data.title }}</header>
        </template>
    </BaseWindow>
</template>
  
  
  
<script setup>
import { defineProps, ref } from "vue";
import { wact } from "../../windows/window-manager.js";

import BaseWindow from "../../components/window.vue";
const props = defineProps({
    item: Object,
    actionWindowId: String,
});
const jvmArg = ref(props.item.data.jvmTargetName);
const applicationArg = ref(props.item.data.applicationTargetName);
const logPath = ref(props.item.data.logTargetName);

const finish = () => {
    wact.closeWindow(props.item.id);
    props.item.data.callback({ jvmArg: jvmArg.value, applicationArg: applicationArg.value, logPath: logPath.value }, props.item);
};
const inputKeyUp = (e) => {
    if (e.keyCode == 13) finish()
}
</script>
  
<style lang="less" >
@import "../../assets/less/run-jar-dialog.less";
</style>