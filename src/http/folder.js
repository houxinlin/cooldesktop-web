import axios from "./axios.js";
import qs from 'qs'



export function apiListDirectory(params) {
    return axios.get("/desktop/api/file/list?", {
        params: {
            root: params
        }
    });
}
export function apiDeleteFileOrFolder(params) {
    return axios.get("/desktop/api/file/delete?", {
        params: {
            path: params
        }
    });
}


export function apiChunkFileUpload(data, config) {
    return axios.post("/desktop/api/file/chunkUpload", data, config);
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
    return axios.post("/desktop/api/file/fileCopy", qs.stringify({
        path: path
    }));
}
export function apiFilePaste(path) {
    return axios.post("/desktop/api/file/filePaste", qs.stringify({
        path: path
    }), { timeout: 60 * 1000 * 30 });
}
export function apiFileCut(path) {
    return axios.post("/desktop/api/file/fileCut", qs.stringify({
        path: path
    }));
}
export function apiFileRename(source, newName) {
    return axios.post("/desktop/api/file/fileRename", qs.stringify({
        newName: newName,
        source: source
    }));
}
export function apiFileCompress(path, targetName, compressType) {
    return axios.post("/desktop/api/file/fileCompress", qs.stringify({
        path,
        targetName,
        compressType
    }));
}