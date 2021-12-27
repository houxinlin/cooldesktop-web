
import { reactive } from "vue";
import { wact } from "../../windows/window-manager"
export const limit = { max: 3, current: 0 }
export const uploads = reactive({ files: [] });
import { Queue } from "../queue.js"
export const uploadQueue = { files: new Queue() }

export const addProgress = (uploadInfo) => {
    uploadInfo.controller = new AbortController();;
    uploads.files.push(uploadInfo)
}
export const getController = (id) => {
    let item = uploads.files.find((res) => { return res.id == id }).controller || null;
    return item;
}
export const createProgress = (name, icon) => {
    return { "name": name, icon: icon, "progress": 0 }
}
export const cancel = (id) => {
    let controller = getController(id);
    if (controller != null) {
        controller.abort();
    }
    let result = -1;
    result = uploadQueue.files.findIndex((res) => { return res != undefined && res.uploadId == id });
    while (result >= 0) {
        uploadQueue.files.splice(result, 1);
        result = uploadQueue.files.findIndex((res) => { return res != undefined && res.uploadId == id });
    }
    let proid = uploads.files.findIndex((res) => { return res.id == id })
    if (proid >= 0) {
        uploads.files.splice(proid, 1);
    }


}
export const removeById = (id) => {
    var index = uploads.files.findIndex((value) => value.id == id);
    uploads.files.splice(index, 1);
    if (uploads.files.length == 0) {
        // wact.closeWindowByType("upload-manager")
    }
}
export const changeProgress = (id, value) => {
    if (value == 100) {
        removeById(id);
    }
    for (const iterator of uploads.files) {
        if (iterator.id == id) {
            iterator.progress = value
        }
    }
}