import { reactive, getCurrentInstance } from "vue";

import { apiListApplication } from "../http/application.js";

let applicationState = reactive({ applications: [] });
//查找能处理这个类型的引用
export const getApplicationByMedia = (tp) => {
    let result = []
    for (let item of applicationState.applications) {
        if (item.supportMediaTypes.findIndex((e) => e == tp) != -1) {
            result.push(item)
        }
    }
    return result;
}
//根据指定id获取应用
export const getApplicationById = (id) => {
    for (let item of applicationState.applications) {
        if (item.applicationId == id) {
            return item
        }
    }
    return null;
}
export const listApplication = () => {
    return applicationState.applications
}
//刷新应用
export const refreshApplication = () => {
    apiListApplication().then((res) => {
        applicationState.applications = res.data.data;
    });
}
export { applicationState }
