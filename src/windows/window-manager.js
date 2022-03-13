
import { randId, getApplicationIndexUrl, getApplicationIconUrl } from "../utils/utils";
import { reactive } from "vue";
import { createFolder } from "./data/folder.js"
import { WindowActions } from "./window-action";
import * as WindowEnum from "../windows/window-enum.js"
import { uploads } from "../utils/upload/manager";
export const state = reactive({
    desktopScale: true,
    positionX: 0,
    positionY: 0,
    actionWindowId: "",
    //窗口集合
    windowsCollection: [],
    appStarterVisible: false,
    windowVisibleState: [],
});;


const removeWindowActionState = () => {
    for (const iterator of state.windowsCollection) {
        iterator.actionWindow = false
    }
}
const startNewWindow = (windowProperty = {}) => {
    removeWindowActionState();
    wact.hideWindow(false);
    windowProperty.actionWindow = true;
    state.appStarterVisible = false;
    state.actionWindowId = windowProperty.id;
    state.windowsCollection.push(windowProperty);
}
export const createWindowByType = (desktopWindow, data = {}) => {
    let windowProperty = desktopWindow(data)
    windowProperty.id = "window-id" + randId();
    windowProperty.closeWindow = () => { wact.closeWindow(windowProperty.id) }
    return windowProperty;
}
class CoolWindowStarter {

    openStarter = () => {
        wact.hideWindow(!state.appStarterVisible)
        state.appStarterVisible = !state.appStarterVisible;
    };

    openNewFolder = (path = "/") => {
        startNewWindow(createWindowByType(WindowEnum.FolderWindow, createFolder(path, [])))
    };
    openFileUploadManager = () => {
        startNewWindow(createWindowByType(WindowEnum.UploadManager, uploads))
    };
    startNewErrorMessageDialog = (msg) => {
        startNewWindow(createWindowByType(WindowEnum.ErrorMessage, { "message": msg }))
    }

    startNewSuccessMessageDialog = (msg) => {
        startNewWindow(createWindowByType(WindowEnum.SuccessMessage, { "message": msg }))
    }
    startNewDialogSelect = (name, callback) => {
        startNewWindow(createWindowByType(WindowEnum.DialogCompressSelect, { "targetName": name, callback }))
    }
    startNewFileAttribute = (name) => {
        startNewWindow(createWindowByType(WindowEnum.FileAttribute, { "path": name }))
    }

    startNewDialogCreateFile = (callback) => {
        startNewWindow(createWindowByType(WindowEnum.DialogCreateFile, { callback }))
    }
    startNewTerminal = (path) => {
        startNewWindow(createWindowByType(WindowEnum.Terminal, { path }))
    }
    startNewWebView = (application, args = null) => {
        let window = createWindowByType(WindowEnum.WebWindow, { url: getApplicationIndexUrl(application, args), application })
        window.icon = getApplicationIconUrl(application)
        startNewWindow(window)
    }
    startNewLoadingView = (msg = "") => {
        let window = createWindowByType(WindowEnum.LoadingView, { message: msg })
        startNewWindow(window)
        return window
    }
    startSoftware = (data = {}) => {
        startNewWindow(createWindowByType(WindowEnum.Software, { data }))
    }
    startSetting = (data = {}) => {
        startNewWindow(createWindowByType(WindowEnum.Setting, { data }))
    }
    startCustomApplication = (data = {}) => {
        startNewWindow(createWindowByType(WindowEnum.CustomApplication, { data }))
    }
}
export const coolWindow = new CoolWindowStarter();
export const wact = new WindowActions();
