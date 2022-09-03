import axios from "./axios.js";
import qs from 'qs'
export function apiGetSpaceStatus(root = "/") {
    return axios.get("/desktop/api/file/space/status", { params: { root } });
}

export function apiListDirectory(params) {
    return axios.get("/desktop/api/file/list", { params: { root: params } });
}
export function apiDeleteFileOrFolder(params) {
    return axios.get("/desktop/api/file/delete?", { params: { path: params } });
}

export function apiChunkFileUpload(chunkFile, axiosRequestConfig) {
    return axios.post("/desktop/api/file/chunkUpload", chunkFile, axiosRequestConfig);
}
export function apiChunkFileMerge(chunkId, targetName, inPath, size) {
    return axios.post("/desktop/api/file/chunkFileMerge", qs.stringify({
        name: chunkId,
        targetName: targetName,
        inPath: inPath,
        size, size
    }));
}
export function apiFileCopy(path) {
    return axios.post("/desktop/api/file/fileCopy", qs.stringify({ path: path }));
}
export function apiFilePaste(path, taskId) {
    return axios.post("/desktop/api/file/filePaste", qs.stringify({
        path,
        taskId
    }), { timeout: 60 * 1000 * 30 });
}
export function apiFileCut(path) {
    return axios.post("/desktop/api/file/fileCut", qs.stringify({ path: path }));
}
export function apiFileRename(source, newName) {
    return axios.post("/desktop/api/file/fileRename", qs.stringify({
        newName: newName,
        source: source
    }));
}
export function apiFileCompress(path, targetName, compressType, taskId) {
    return axios.post("/desktop/api/file/fileCompress", qs.stringify({
        path,
        targetName,
        compressType,
        taskId
    }));
}
export function apiFileDecompression(path, taskId) {
    return axios.post("/desktop/api/file/fileDecompression", qs.stringify({
        path,
        taskId
    }));
}
export function apiFileAttribute(path) {
    return axios.post("/desktop/api/file/getFileAttribute", qs.stringify({
        path
    }));
}
export function apiCreateFile(parent, name, type) {
    return axios.post("/desktop/api/file/createFile", qs.stringify({
        parent, name, type
    }));
}

export function apiRunJar(path, arg, type) {
    let config = {
        timeout: 1000 * 15,
    };
    return axios.post("/desktop/api/file/runJar", qs.stringify({
        path, arg, type
    }), config);
}

export function apiStopJar(path) {
    return axios.post("/desktop/api/file/stopJar", qs.stringify({
        path
    }));
}

export function apiRunShell(path) {
    return axios.post("/desktop/api/file/runShell", qs.stringify({
        path
    }));
}
export function apiTailStart(path) {
    return axios.post("/desktop/api/file/tail/start", qs.stringify({
        path
    }));
}
export function apiTailStop(id) {
    return axios.post("/desktop/api/file/tail/stop", qs.stringify({
        id
    }));
}
export function apiCreateShareLink(path, day) {
    return axios.post("/desktop/api/file/share/link/create", qs.stringify({ path, day }));
}

export function apiListShareLink() {
    return axios.get("/desktop/api/file/share/link/list");
}
export function apiDeleteShareLink(id) {
    return axios.post("/desktop/api/file/share/link/delete", qs.stringify({ id }));
}