import { apiListApplication } from "../http/application.js";
import { reactive } from "vue";
let applicationState = reactive({ applications: [] });

//查找能处理这个类型的引用
export const getApplicationByMedia = (tp) => {
    let result = []
    for (let item of applicationState.applications) {
        if (item.handlerMediaTypes.findIndex((e) => e == tp) != -1) {
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
//刷新应用
export const refreshApplication = () => {
    apiListApplication().then((res) => {
        applicationState.applications = res.data.data;
    });
}
export { applicationState }
