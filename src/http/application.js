import axios from "./axios.js";
import qs from 'qs'


export function apiListApplication() {
    return axios.get("/desktop/api/application/list");
}