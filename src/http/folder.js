import axios from "./axios.js";

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

// export function apiGetImageThumbnail(params) {
//     return axios.get("/desktop/api/file/getImageThumbnail?", {
//         params: {
//             path: params
//         }
//     });
// }