import * as folderApis from "../../http/folder.js";
import { randId } from "../../utils/utils.js";
import { addProgress, changeProgress, removeById, uploads, limit, uploadQueue, getController } from "./manager.js";

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
    constructor(file, uploadId, blobId, isChunks, progress, target, fileName, totalSize) {
        this.file = file;
        this.uploadId = uploadId;
        this.blobId = blobId;
        this.isChunks = isChunks
        this.progress = progress;
        this.target = target;
        this.fileName = fileName;
        this.total = totalSize;
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
let intervalId = null;

const handlerItem = (item) => {
    let config = {
        signal: getController(item.uploadId).signal,
        timeout: UPLOAD_TIMER_OUT,
        headers: {},
        onUploadProgress: item.progress
    };
    let formData = createFormData(item.file, item.uploadId, item.blobId, item.target, item.fileName, item.total)
    folderApis.apiChunkFileUpload(formData, config)
        .then((res => { if (limit.current > 0) limit.current-- }))
        .catch((res) => { if (limit.current > 0) limit.current-- })
}
const fileDequeue = () => {
    console.log("limit", limit)
    if (limit.current < limit.max) {
        let item = uploadQueue.files.dequeue();
        if (item != undefined) {
            handlerItem(item)
            return
        }
        limit.current = 0;
        clearInterval(intervalId);
        isStart = false;
    }
}
export const startConsumer = () => {
    if (!isStart) {
        isStart = true;
        intervalId = setInterval(fileDequeue, 120);
    }
}

function createChunksUpload(file, target) {
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
        uploadQueue.files.enqueue(new FileItemInfo(chunkItem.data, uploadId, chunkItem.id, true, onUploadProgress, target, file.name, file.size))
    }
}
function createSingleFileUpload(file, target) {
    let uploadId = randId();
    let onUploadProgress = (progressEvent) => {
        var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
        );
        changeProgress(uploadId, percentCompleted)
        return percentCompleted;
    }
    addProgress({ id: uploadId, name: file.name, progress: "0" })
    uploadQueue.files.enqueue(new FileItemInfo(file, uploadId, "0", false, onUploadProgress, target, file.name, file.size))
}


export class FileUpload {
    constructor() {
    }
    start(file, inPath, callback) {
        startConsumer()
        if (file.size > CHUNK_SIZE_MB) {
            createChunksUpload(file, inPath)
            return
        }
        createSingleFileUpload(file, inPath)
    }
}

const createFormData = (file, chunkId, blobId, target, fileName, fileSize) => {
    let formData = new FormData();
    formData.append("target", target);
    formData.append("fileBinary", file);
    formData.append("chunkId", chunkId);
    formData.append("blobId", blobId);
    formData.append("fileName", fileName)
    formData.append("total", fileSize)
    return formData;
}