import * as folderApis from "../../http/folder.js";
import { randId } from "../../utils/utils.js";
import { add, changeProgress, removeById, uploads } from "./manager.js";

const getChunk = (file) => {
    let chunkSize = Math.ceil(file.size / (20 * 1024 * 1024));
    let chunks = [];
    for (let i = 0; i < chunkSize; i++) {
        let start = i * (20 * 1024 * 1024);
        let end = start + 20 * 1024 * 1024;
        let item = file.slice(start, end);
        chunks.push({ id: i, data: item });
    }
    return chunks;
}
function onUploadProgress(params) {

}
function sum(arr) {
    let total = 0;
    for (var i in arr) {
        total += arr[i]
    }
    return total;
}
export class FileUpload {
    constructor(file) {
        this.file = file;
    }
    start(inPath, callback) {
        let file = this.file
        let chunkId = randId();
        if (file.size > 20 * 1024 * 1024) {
            let chunks = getChunk(file);
            let uploadProgress = [...new Array(chunks.length).keys()];
            let uploadPromise = [];
            add({ id: chunkId, name: file.name, progress: "0" })
            for (const iterator of chunks) {
                let formDate = new FormData();
                let config = {
                    timeout: 3 * 60 * 1000,
                    headers: {},
                    onUploadProgress(progressEvent) {
                        var percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        uploadProgress[parseInt(iterator.id)] = percentCompleted;
                        let gess = sum(uploadProgress) / (chunks.length * 100);
                        changeProgress(chunkId, gess * 100)
                        return percentCompleted;
                    },
                };

                formDate.append("chunkId", chunkId);
                formDate.append("blobId", iterator.id);
                formDate.append("file", iterator.data);
                uploadPromise.push(folderApis.apiChunkFileUpload(formDate, config));
            }
            // add({ name: "a", progress: "10" })
            Promise.all(uploadPromise).then((res) => {
                folderApis
                    .apiChunkFileMerge(chunkId, file.name, inPath, chunks.length)
                    .then((res) => {
                        removeById(chunkId);
                        callback(res);
                    });
            });
        } else {
            let config = {
                timeout: 3 * 60 * 1000,
                headers: {},
                onUploadProgress(progressEvent) {
                    var percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    changeProgress(chunkId, percentCompleted)
                    return percentCompleted;
                },
            };
            add({ id: chunkId, name: file.name, progress: "0" })
            folderApis.apiChunkFileUpload(createFormData(file, chunkId, 0), config).then((res) => {
                folderApis
                    .apiChunkFileMerge(chunkId, file.name, inPath, 1)
                    .then((res) => {
                        removeById(chunkId);
                        callback(res);
                    });
            });
        }
    }
}

const createFormData = (file, chunkId, blobId) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("chunkId", chunkId);
    formData.append("blobId", blobId);
    return formData;
}