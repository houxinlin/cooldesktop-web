import { softwareServer } from "./axios.js";
import defaultAxios from "./axios.js";
import qs from 'qs'

export function apiListAllSoftware(name) {
    return softwareServer.get("software/api/list", { params: { typeName: name } });
}

export function apiListAllSoftwareTypes(params) {
    return softwareServer.get("software/api/types");
}

export function apiUnInstallSoftware(id) {
    return defaultAxios.post("/desktop/api/application/uninstall", qs.stringify({
        id: id
    }));
}



export function apiInstallSoftware(id) {
    return defaultAxios.post("/desktop/api/application/install", qs.stringify({
        id: id
    }));
}

