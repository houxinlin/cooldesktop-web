import * as folderApis from "../../http/folder.js";
import { randId } from "../../utils/utils.js";
import { addProgress, changeProgress, removeById, uploads, limit, uploadQueue } from "./manager.js";
const UPLOAD_TIMER_OUT = 1000 * 60 * 15;
const CHUNK_SIZE_MB = 15 * 1024 * 1024;
function sum(arr) {
    let total = 0;
    for (var i in arr) {
        total += arr[i]
    }
    return total;
}
class FileItemInfo {
    constructor(file, uploadId, blobId, isChunks, progress) {
        this.file = file;
        this.uploadId = uploadId;
        this.blobId = blobId;
        this.isChunks = isChunks
        this.progress = progress;
    }
}
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

let isStart = false
export const startConsumer = () => {
    if (!isStart) {
        isStart = true;
        let id = setInterval(() => {
            if (limit.current < limit.max) {
                let item = uploadQueue.dequeue();
                if (item != undefined) {
                    limit.current++
                    let config = {
                        timeout: UPLOAD_TIMER_OUT,
                        headers: {},
                        onUploadProgress: item.progress
                    };
                    let formData = createFormData(item.file.data, item.uploadId, item.blobId)
                    folderApis.apiChunkFileUpload(formData, config).then((res => {
                        limit.current--
                    })).catch((res) => { limit.current-- })
                } else {
                    clearInterval(id)
                    isStart = false;
                }
            } else {
            }

        }, 150);
    }
}

function createChunksUpload(file) {
    let uploadId = randId();
    let chunks = getChunk(file);
    addProgress({ id: uploadId, name: file.name, progress: "0" })
    let uploadProgress = [...new Array(chunks.length).keys()];
    for (const chunkItem of chunks) {
        let onUploadProgress = (progressEvent) => {
            var percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            uploadProgress[parseInt(chunkItem.id)] = percentCompleted;
            let gess = sum(uploadProgress) / (chunks.length * 100);
            changeProgress(uploadId, gess * 100)
            return percentCompleted;
        }
        uploadQueue.enqueue(new FileItemInfo(chunkItem, uploadId, chunkItem.id, true, onUploadProgress))
    }
}
function createSingleFileUpload(file) {
    let uploadId = randId();
    let onUploadProgress = (progressEvent) => {
        var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        changeProgress(chunkId, percentCompleted)
        return percentCompleted;
    }
    addProgress({ id: chunkId, name: file.name, progress: "0" })
    uploadQueue.enqueue(new FileItemInfo(file, uploadId, "0", false, onUploadProgress))
}


export class FileUpload {
    constructor(file) {
        this.file = file;
    }
    start(inPath, callback) {
        startConsumer()
        let file = this.file
        if (file.size > CHUNK_SIZE_MB) {
            createChunksUpload(file)
            return
        }
        createSingleFileUpload(file)
    }
}

const createFormData = (file, chunkId, blobId) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("chunkId", chunkId);
    formData.append("blobId", blobId);
    formData.append("total", file.size)
    return formData;
}