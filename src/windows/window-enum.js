export function BaseWindow() {
    this.minState = false;
    this.maxState = false;
    this.actionWindow = true;
    this.windowTransition = false;
    this.windowType = "web";
    this.pointerEvents = false;
    this.hideWindow = false;
    this.canMax = true;
    this.canMin = true;
    this.canClose = true;
    this.icon = "";
    this.id = "";
    this.x = 0;
    this.y = 0;
    this.closeWindowTransition = false
    this.canResize=true
}
// export function EnableCloseWindow(data) {
//     this.windowType = "folder"
//     this.icon = "/src/assets/icon/ic-folder.png"
//     this.data = data;
// }
export function Folder(data) {
    this.windowType = "folder"
    this.icon = "/src/assets/icon/ic-folder.png"
    this.data = data;
}
export function UploadManager(data) {
    this.windowType = "upload-manager"
    this.icon = "/src/assets/icon/ic-folder.png"
    this.data = data;
    this.canClose=false
}
export function ErrorMessage(data) {
    this.windowType = "error-message"
    this.data = data;
}
export function SuccessMessage(data) {
    this.windowType = "success-message"
    this.data = data;
}
export function WebWindow() {
    this.windowType = "web-window"
}
export function NotifyWindow() {
    this.windowType = "notif-window"
}

export function DialogSelect(data) {
    this.windowType = "dialog-select"
    this.data = data;
}
export function FileAttribute(data) {
    this.windowType = "file-attribute"
    this.data = data;
}
