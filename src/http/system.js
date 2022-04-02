

import axios from "./axios.js";
import qs from 'qs'
const UPLOAD_TIMER_OUT = 1000 * 60 * 15;

export function apiChangeWallpaper(wallpaperFile) {
    let config = {
        timeout: UPLOAD_TIMER_OUT,
    };
    return axios.post("/desktop/api/system/changeWallpaper", wallpaperFile, config);
}
export function apiGetSystemProperty() {
    return axios.post("/desktop/api/system/getCoolDesktopProperty");
}
export function apiConfigSecureShell() {
    return axios.post("/desktop/api/system/configSecureShell");
}
export function apiConfigSecureShellUser(userName) {
    return axios.post("/desktop/api/system/configSecureShellUser", qs.stringify({
        userName
    }));
}
export function apiResetLogoPasswd() {
    return axios.post("/desktop/api/system/resetLogoPasswd");
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





