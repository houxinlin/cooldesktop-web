import { applicationServer } from "./axios.js";
import defaultAxios from "./axios.js";
import qs from 'qs'


export function apiListApplication() {
    return defaultAxios.get("/desktop/api/application/list");
}


export function apiListAllApplicationByType(name) {
    return applicationServer.get("software/api/list", { params: { typeName: name } });
}

export function apiListAllApplicationType(params) {
    return applicationServer.get("software/api/types");
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
    return defaultAxios.post("/desktop/api/application/installCustomApplication", application, axiosRequestConfig);
}

