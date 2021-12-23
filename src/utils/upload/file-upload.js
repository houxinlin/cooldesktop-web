import * as folderApis from "../../http/folder.js";
import { randId } from "../../utils/utils.js";
import { add, changeProgress, removeById, uploads } from "./manager.js";
const UPLOAD_TIMER_OUT = 1000 * 60 * 15;
const CHUNK_SIZE_MB = 15 * 1024 * 1024;
const getChunk = (file) => {
    let chunkSize = Math.ceil(file.size / (CHUNK_SIZE_MB));
    let chunks = [];
    for (let i = 0; i < chunkSize; i++) {
        let start = i * (CHUNK_SIZE_MB);
        let end = start + CHUNK_SIZE_MB;
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
        let errorPromise = []
        if (file.size > CHUNK_SIZE_MB) {
            let chunks = getChunk(file);
            let uploadProgress = [...new Array(chunks.length).keys()];
            let uploadPromise = [];
            add({ id: chunkId, name: file.name, progress: "0" })
            for (const iterator of chunks) {
                let formDate = new FormData();
                let config = {
                    timeout: UPLOAD_TIMER_OUT,
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
                uploadPromise.push(folderApis.apiChunkFileUpload(formDate, config).then((res => { })).catch((res) => {

                }));
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
                timeout: UPLOAD_TIMER_OUT,
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