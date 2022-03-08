

import axios from "./axios.js";
import qs from 'qs'


export function apiChangeWallpaper(wallpaperFile) {
    return axios.post("/desktop/api/system/changeWallpaper", wallpaperFile);
}
export function apiGetSystemProperty() {
    return axios.post("/desktop/api/system/getCoolDesktopProperty");
}
export function apiConfigSecureShell() {
    return axios.post("/desktop/api/system/configSecureShell");
}
export function apiConfigSecureShellUser(userName) {
    return axios.post("/desktop/api/system/configSecureShellUser", qs.stringify({
        userName: userName
    }));
}