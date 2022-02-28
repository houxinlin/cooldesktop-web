import { softwareServer } from "./axios.js";
import defaultAxios from "./axios.js";
import qs from 'qs'

export function apiListAllSoftware(name) {
    return softwareServer.get("software/api/list", { params: { typeName: name } });
}

export function apiListAllSoftwareTypes(params) {
    return softwareServer.get("software/api/types");
}



export function apiInstallSoftware(id) {
    return defaultAxios.get("/desktop/api/application/install", { params: { id: id } });
}

