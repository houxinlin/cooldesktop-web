

import axios from "./axios.js";
import qs from 'qs'
const UPLOAD_TIMER_OUT = 1000 * 60 * 15;

export function apiChangeWallpaper(wallpaperFile) {
    let config = {
        timeout: UPLOAD_TIMER_OUT,
    };
    return axios.post("/desktop/api/system/changeWallpaper", wallpaperFile, config);
}
export function apiGetCoolDesktopConfigs() {
    return axios.post("/desktop/api/system/getCoolDesktopConfigs");
}
export function apiConfigSecureShell() {
    return axios.post("/desktop/api/system/configSecureShell");
}
export function apiConfigSecureShellUser(userName) {
    return axios.post("/desktop/api/system/configSecureShellUser", qs.stringify({
        userName
    }));
}
export function apiResetLoginPasswd() {
    return axios.post("/desktop/api/system/resetLoginPasswd");
}

export function apiGetOpenUrl() {
    return axios.post("/desktop/api/system/getOpenUrl");
}

export function apiAddOpenUrl(url) {
    return axios.post("/desktop/api/system/addOpenUrl", qs.stringify({
        url
    }));
}

export function apiRemoveOpenUrl(url) {
    return axios.post("/desktop/api/system/removeOpenUrl", qs.stringify({
        url
    }));
}





export function apiSetSysProperty(key, value) {
    return axios.post("/desktop/api/system/setSysProperty", qs.stringify({
        key, value
    }));
}


export function apiGetSysProperty(key) {
    return axios.post("/desktop/api/system/getSysProperty", qs.stringify({
        key
    }));
}

export function apiAddDesktopFile(path) {
    return axios.post("/desktop/api/system/desktop/file/add", qs.stringify({
        path
    }));
}

export function apiRemoveDesktopFile(path) {
    return axios.post("/desktop/api/system/desktop/file/remove", qs.stringify({
        path
    }));
}

export function apiListDesktopFile() {
    return axios.get("/desktop/api/system/desktop/file/list");
}

