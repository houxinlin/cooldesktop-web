import axios from "./axios.js";

export function apiListDirectory(params) {
    return axios.get("/desktop/api/file/list?", {
        params: {
            root: params
        }
    });
}