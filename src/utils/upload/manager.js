
import { reactive } from "vue";
import { wact } from "../../windows/window-manager"
export const limit = { max: 3, current: 0 }
export const uploads = reactive({ files: [] });
import { Queue } from "../queue.js"

export const uploadQueue = new Queue()
export const addProgress = (uploadInfo) => {
    console.log(uploadInfo)
    uploads.files.push(uploadInfo)
}

export const cancel = (uploadInfo) => {
    uploads.push(uploadInfo)
}
export const removeById = (id) => {
    var index = uploads.files.findIndex((value) => value.id == id);
    uploads.files.splice(index, 1);
    if (uploads.files.length == 0) {
        wact.closeWindowByType("upload-manager")
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