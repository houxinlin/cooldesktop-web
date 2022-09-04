import defaultAxios from "./axios.js";
import qs from 'qs'


export function apiListApplication() {
    return defaultAxios.get("/desktop/api/application/list");
}


export function apiListAllApplicationByType(name) {
    return defaultAxios.get("/desktop/api/application/server/app/list", { params: { typeName: name } });
}

export function apiListAllApplicationType() {
    return defaultAxios.get("/desktop/api/application/server/type/list");
}

export function apiUnInstallApplication(id) {
    return defaultAxios.post("/desktop/api/application/uninstall", qs.stringify({
        id: id
    }));
}



export function apiInstallApplication(id) {
    return defaultAxios.post("/desktop/api/application/install", qs.stringify({
        id: id
    }));
}



export function apiInstallCustomApplication(application, axiosRequestConfig) {
    return defaultAxios.post("/desktop/api/application/custom/application/install", application, axiosRequestConfig);
}

