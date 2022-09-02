

import axios from "./axios.js";
import qs from 'qs'
const UPLOAD_TIMER_OUT = 1000 * 60 * 15;

export function apiChangeWallpaper(wallpaperFile) {
    let config = {
        timeout: UPLOAD_TIMER_OUT,
    };
    return axios.post("/desktop/api/system/wallpaper/change", wallpaperFile, config);
}

export function apiGetCoolDesktopConfigs() {
    return axios.get("/desktop/api/system/cooldesktop/config/get");
}
export function apiSetCoolDesktopConfigs(key, value) {
    return axios.post("/desktop/api/system/cooldesktop/config/set", qs.stringify({
        key, value
    }));
}

export function apiSetSoftwareServerHost(value) {
    return apiSetCoolDesktopConfigs("application_server_host", value);
}

export function apiConfigSecureShell() {
    return axios.post("/desktop/api/system/ssh/reset");
}

export function apiConfigSecureShellUser(userName) {
    return axios.post("/desktop/api/system/ssh/username/set", qs.stringify({
        userName
    }));
}
export function apiResetLoginPasswd(pass) {
    return axios.post("/desktop/api/system/login/passwd/reset", qs.stringify({
        pass
    }));
}

export function apiGetOpenUrl() {
    return axios.get("/desktop/api/system/open/url/get");
}

export function apiAddOpenUrl(url) {
    return axios.post("/desktop/api/system/open/url/add", qs.stringify({
        url
    }));
}

export function apiRemoveOpenUrl(url) {
    return axios.post("/desktop/api/system/open/url/add", qs.stringify({
        url
    }));
}

export function apiSetAppProperty(key, value) {
    return axios.post("/desktop/api/system/app/property/set", qs.stringify({
        key, value
    }));
}

export function apiGetAppProperty(key) {
    return axios.get("/desktop/api/system/app/property/get", {
        params: {
            key
        }
    });
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

export function apiGetBaseInfo() {
    return axios.get("/desktop/api/system/system/info/base");
}

export function apiGetSystemLog(logType, logLevel, filterTimer, page) {
    return axios.get("/desktop/api/system/log/list", {
        params: {
            logType, logLevel, filterTimer, page
        }
    });
}