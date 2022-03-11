let progressMap = new Map()
import * as softworeApi from "../http/software.js";
import { defineProps, reactive, ref, getCurrentInstance } from "vue";
import { getApplicationById, refreshApplication } from "../global/application.js"
export const initInstallProgressManager = () => {
    let { proxy } = getCurrentInstance()
    proxy.eventBus.on("/event/install/progress", (e) => {
        let refProgressValue = getRefProgressValue(e.id)
        let value = parseInt(e.progress)
        if (value > 1) { refProgressValue.value = value }//1被预留了
    })

    //服务端通知软件安装完成
    //并且刷新应用
    proxy.eventBus.on("/event/install/done", (e) => {
        getRefProgressValue(e.id).value = -1
        refreshApplication()
    })
}
//添加进度
export const addProgress = (softwareId, value) => {
    progressMap.set(softwareId, value)
}
//开始安装
export const beginInstall = (softwareId) => {
    softworeApi.apiInstallSoftware(softwareId).then((res) => {
        getRefProgressValue(softwareId).value = 1
    })
}
export const clearRefProgressValue = (softwareId) => {
    progressMap.delete(softwareId)
}
//获取进度值
export const getRefProgressValue = (softwareId) => {
    if (!progressMap.has(softwareId)) {
        if (getApplicationById(softwareId) != null) {
            progressMap.set(softwareId, ref(-1))//已经安装
        } else {
            progressMap.set(softwareId, ref(0))//进度
        }

    }
    return progressMap.get(softwareId)
}