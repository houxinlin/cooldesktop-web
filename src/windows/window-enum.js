import defaultApps from "../application/default-applications.js"
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
    canResize: true,
    singleInstance: false,
    visibilityIsDesktop: false,
    autoSaveWindowSize:true
}

function getWindowProperty(windowProperty, data = {}) {
    return Object.assign({}, BASE_WINDOW_PROPERTYS, windowProperty, { data });
}
export function ErrorMessage(data) {
    return getWindowProperty({ applicationId: 1, application: { "windowBackground": "#c95447d4", windowSize: 29884616 }, windowType: "error-message", showWindowInTaskBar: false, canMax: false, canMin: false }, data);
}
export function SuccessMessage(data) {
    return getWindowProperty({ applicationId: 2, windowType: "success-message", application: { windowSize: 29884616 }, showWindowInTaskBar: false, canMax: false, canMin: false }, data);
}
export function WebWindow(data) {
    return getWindowProperty({ windowType: "web" }, data);
}
export function NotifyWindow() {
    return getWindowProperty({ applicationId: 4, windowType: "notif-window" }, data);
}
export function DialogCompressSelect(data) {
    return getWindowProperty({ applicationId: 5, windowType: "dialog-compress-select", application: { windowSize: 27525378 }, showWindowInTaskBar: false, canMax: false, canMin: false }, data);
}
export function FileAttribute(data) {
    return getWindowProperty({ applicationId: 6, windowType: "file-attribute", application: { windowSize: 28181080 } }, data);
}
export function DialogCreateFile(data) {
    return getWindowProperty({ applicationId: 7, windowType: "dialog-create-file", showWindowInTaskBar: false, canMax: false, canMin: false }, data);
}
export function DialogInput(data) {
    return getWindowProperty({ applicationId: 8, windowType: "input-dialog", application: { windowSize: 27525280 }, showWindowInTaskBar: false, canMax: false, canMin: false }, data);
}
export function TextEditor(data) {
    return getWindowProperty({ applicationId: 9, windowType: "text-editor" }, data);
}
export function LoadingView(data) {
    return getWindowProperty({ applicationId: 10, windowType: "loading-view", application: { windowSize: 9175220 }, showWindowInTaskBar: false, canClose: false, canMin: false, canResize: false }, data);
}
export function FolderWindow(data = {}) {
    return getWindowProperty({ applicationId: 11, windowType: "folder", "icon": defaultApps[0].icon, isSelect: false }, data);
}
export function FileSelectWindow(data = {}) {
    return getWindowProperty({ applicationId: 12, windowType: "folder", "icon": defaultApps[0].icon, canMin: false, canMax: false, isSelect: true }, data);
}
export function UploadManager(data) {
    return getWindowProperty({ applicationId: 13, windowType: "upload-manager", "icon": defaultApps[1].icon }, data);
}
export function Terminal(data) {
    return getWindowProperty({ applicationId: 14, application: { "windowBackground": "#0b0a0bcc", windowSize: 56885748 }, windowType: "terminal", "icon": defaultApps[2].icon }, data);
}
export function Software(data) {
    return getWindowProperty({ applicationId: 15, windowType: "software", "icon": defaultApps[3].icon }, data);
}
export function Setting(data) {
    return getWindowProperty({ applicationId: 16, windowType: "setting", "icon": defaultApps[4].icon }, data);
}

export function CustomApplication(data) {
    return getWindowProperty({ applicationId: 17, windowType: "custom-application", "icon": defaultApps[5].icon, canMax: false }, data);
}
export function DeveloperDoc(data) {
    return getWindowProperty({ applicationId: 18, windowType: "developer-doc", "icon": defaultApps[6].icon }, data);
}

export function Tail(data) {
    return getWindowProperty({ visibilityIsDesktop: false, applicationId: 19, windowType: "tail", "icon": defaultApps[7].icon }, data);
}

export function SysLog(data) {

    return getWindowProperty({  application: { "windowBackground": "#0b0a0bcc", windowSize: 56885748 }, applicationId: 20, windowType: "sys-log", "icon": defaultApps[8].icon }, data);

}

