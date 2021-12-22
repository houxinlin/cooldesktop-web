
import { reactive } from "vue";
import { wact } from "../../windows/window-manager"
export const uploads = reactive({ files: [] });
export const add = (uploadInfo) => {
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
    for (const iterator of uploads.files) {
        if (iterator.id == id) {
            iterator.progress = value
        }
    }
}