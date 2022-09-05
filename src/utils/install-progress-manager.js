let progressMap = new Map()
import * as applicationApi from "../http/application.js";
import { ref, getCurrentInstance } from "vue";
import { getApplicationById, refreshApplication } from "../global/application.js";
import { compareVersion } from "./utils.js";
export const initInstallProgressManager = () => {
    let { proxy } = getCurrentInstance()
 
    //安装进度
    proxy.eventBus.on("/event/install/progress", (e) => {
        let value = parseInt(e.progress)
        changeProgressValue(e.id, value);
    })
    //安装状态
    proxy.eventBus.on("/event/software/status",(e)=>{
       
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
        changeProgressValue(applicationId, 0);
    })
}
export const clearRefProgressValue = (applicationId) => {
    progressMap.delete(applicationId)
}

const changeProgressValue = (applicationId, targetValue) => {
    return progressMap.get(applicationId).value = targetValue;
}
//获取进度值
export const getRefProgressValue = (application) => {
    let applicationId = application.softwareId;
    // 如果进度条列表中不存在，判断是否安装
    if (!progressMap.has(applicationId)) {
        //是否已经安装
        if (getApplicationById(applicationId) != null) {
            //是否需要更新
            let result = compareVersion(getApplicationById(applicationId).applicationVersion, application.softwareVersion);
            progressMap.set(applicationId, result < 0 ? ref(-6) : ref(-3))//已经安装

        } else {
            //返回正在安装
            progressMap.set(applicationId, ref(-2))//进度
        }

    }
    return progressMap.get(applicationId)
}
