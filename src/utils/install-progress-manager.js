let progressMap = new Map()
import * as applicationApi from "../http/application.js";
import { ref, getCurrentInstance } from "vue";
import { getApplicationById, refreshApplication } from "../global/application.js"
export const initInstallProgressManager = () => {
    let { proxy } = getCurrentInstance()

    proxy.eventBus.on("/event/install/progress", (e) => {
        let refProgressValue = getRefProgressValue(e.id)
        let value = parseInt(e.progress)
        refProgressValue.value = value
    })

    //服务端通知软件安装完成
    //并且刷新应用
    proxy.eventBus.on("/event/install/done", (e) => {
        refreshApplication()
    })
}
//添加进度
export const addProgress = (applicationId, value) => {
    progressMap.set(applicationId, value)
}
//开始安装
export const beginInstall = (applicationId) => {
    applicationApi.apiInstallApplication(applicationId).then((res) => {
        getRefProgressValue(applicationId).value = 0
    })
}
export const clearRefProgressValue = (applicationId) => {
    progressMap.delete(applicationId)
}
//获取进度值
export const getRefProgressValue = (applicationId) => {
    if (!progressMap.has(applicationId)) {
        if (getApplicationById(applicationId) != null) {
            progressMap.set(applicationId, ref(-3))//已经安装

        } else {
            progressMap.set(applicationId, ref(-2))//进度
        }

    }
    return progressMap.get(applicationId)
}