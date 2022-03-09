import defaultApps from "../software/default-software.js"
let BASE_WINDOW_PROPERTYS = {
    showWindowInTaskBar: true,
    minState: false,
    maxState: false,
    actionWindow: true,
    windowTransition: false,
    windowType: "web",
    pointerEvents: false,
    hideWindow: false,
    canMax: true,
    canMin: true,
    canClose: true,
    icon: "",
    id: "",
    x: 0,
    y: 0,
    closeWindowTransition: false,
    canResize: true
}

function getWindowProperty(windowProperty, data = {}) {
    return Object.assign({}, BASE_WINDOW_PROPERTYS, windowProperty, { data })
}

export function ErrorMessage(data) {
    return getWindowProperty({ windowType: "error-message", showWindowInTaskBar: false, canMax: false, canMin: false }, data)
}
export function SuccessMessage(data) {
    return getWindowProperty({ windowType: "success-message", showWindowInTaskBar: false, canMax: false, canMin: false }, data)
}
export function WebWindow(data) {
    return getWindowProperty({ windowType: "web" }, data)
}
export function NotifyWindow() {
    return getWindowProperty({ windowType: "notif-window" }, data)
}

export function DialogCompressSelect(data) {
    return getWindowProperty({ windowType: "dialog-compress-select" }, data)
}
export function FileAttribute(data) {
    return getWindowProperty({ windowType: "file-attribute" }, data)
}
export function DialogCreateFile(data) {
    return getWindowProperty({ windowType: "dialog-create-file" }, data)
}
export function TextEditor(data) {
    return getWindowProperty({ windowType: "text-editor" }, data)
}

export function LoadingView(data) {
    return getWindowProperty({ windowType: "loading-view", "canClose": false }, data)
}
export function FolderWindow(data = {}) {
    return getWindowProperty({ windowType: "folder", "icon": defaultApps[0].icon }, data)
}

export function UploadManager(data) {
    return getWindowProperty({ windowType: "upload-manager", "icon": defaultApps[1].icon }, data)
}
export function Terminal(data) {
    return getWindowProperty({ windowType: "terminal", "icon": defaultApps[2].icon }, data)
}
export function Software(data) {
    return getWindowProperty({ windowType: "software", "icon": defaultApps[3].icon }, data)
}
export function Setting(data) {
    return getWindowProperty({ windowType: "setting", "icon": defaultApps[4].icon }, data)
}

