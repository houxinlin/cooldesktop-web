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
    return axios.post("/desktop/api/file/chunk/upload", chunkFile, axiosRequestConfig);
}
export function apiChunkFileMerge(chunkId, targetName, inPath, size) {
    return axios.post("/desktop/api/file/chunk/file/merge", qs.stringify({
        name: chunkId,
        targetName: targetName,
        inPath: inPath,
        size, size
    }));
}
export function apiFileCopy(path) {
    return axios.post("/desktop/api/file/copy", qs.stringify({ path: path }));
}
export function apiFilePaste(path, taskId) {
    return axios.post("/desktop/api/file/paste", qs.stringify({
        path,
        taskId
    }), { timeout: 60 * 1000 * 30 });
}
export function apiFileCut(path) {
    return axios.post("/desktop/api/file/cut", qs.stringify({ path: path }));
}
export function apiFileRename(source, newName) {
    return axios.post("/desktop/api/file/rename", qs.stringify({
        newName: newName,
        source: source
    }));
}
export function apiFileCompress(path, targetName, compressType, taskId) {
    return axios.post("/desktop/api/file/compress", qs.stringify({
        path,
        targetName,
        compressType,
        taskId
    }));
}
export function apiFileDecompression(path, taskId) {
    return axios.post("/desktop/api/file/decompression", qs.stringify({
        path,
        taskId
    }));
}
export function apiFileAttribute(path) {
    return axios.post("/desktop/api/file/attribute/get", qs.stringify({
        path
    }));
}
export function apiCreateFile(parent, name, type) {
    return axios.post("/desktop/api/file/create", qs.stringify({
        parent, name, type
    }));
}

export function apiRunJar(arg) {
    let config = {
        timeout: 1000 * 15,
    };
    return axios.post("/desktop/api/file/jar/run", qs.stringify(arg), config);
}

export function apiStopJar(path) {
    return axios.post("/desktop/api/file/jar/stop", qs.stringify({
        path
    }));
}

export function apiRunShell(path) {
    return axios.post("/desktop/api/file/shell/run", qs.stringify({
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