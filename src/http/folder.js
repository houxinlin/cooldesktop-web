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
export function apiChunkFileMerge(chunkId, targetName,inPath, size) {
    return axios.post("/desktop/api/file/chunkFileMerge", qs.stringify({
        name: chunkId,
        targetName: targetName,
        inPath:inPath,
        size, size
    }));
}
// export function apiGetImageThumbnail(params) {
//     return axios.get("/desktop/api/file/getImageThumbnail?", {
//         params: {
//             path: params
//         }
//     });
// }