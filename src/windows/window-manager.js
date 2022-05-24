
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

    startNewFolder = (path = "/",single=false) => {
        if(single){
            for (const window of state.windowsCollection) {
                if(window.windowType=="folder"  && path ==window.data.path.path){
                    return
                }
            }
        }
        startNewWindow(createWindowByType(WindowEnum.FolderWindow, createFolder(path, [])))
    };
    startFileUploadManager = () => {
        startNewWindow(createWindowByType(WindowEnum.UploadManager, uploads))
    };
    startNewErrorMessageDialog = (msg) => {
        startNewWindow(createWindowByType(WindowEnum.ErrorMessage, { "message": msg }))
    }

    startNewSuccessMessageDialog = (msg) => {
        startNewWindow(createWindowByType(WindowEnum.SuccessMessage, { "message": msg }))
    }
    startNewCompressDialogSelect = (name, callback) => {
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
        if (application.singleInstance) {
            if (state.windowsCollection.findIndex((item) => { return application.applicationId === (item.application || {}).applicationId }) != -1) {
                wact.showWindowByApplicationId(application.applicationId)
                return
            }
        }
        let window = createWindowByType(WindowEnum.WebWindow, { url: getApplicationIndexUrl(application, args), application })
        window.icon = getApplicationIconUrl(application)
        window.application = application
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
    startNewDeveloperDoc = (data = {}) => {
        startNewWindow(createWindowByType(WindowEnum.DeveloperDoc, { data }))
    }
    startNewFileSelect = (selectType = "file", selectCallback = function (d) { }) => {
        let props = createWindowByType(WindowEnum.FileSelectWindow, createFolder("/", []))
        props.selectCallback = selectCallback
        props.selectType = selectType
        startNewWindow(props)
    }

    startNewInputDialog = (callback, title = "提示") => {
        startNewWindow(createWindowByType(WindowEnum.DialogInput, { callback, title }))
    }
}
export const coolWindow = new CoolWindowStarter();
export const wact = new WindowActions();
