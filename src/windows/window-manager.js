
import { randId } from "../utils/utils";
import { reactive } from "vue";
import { createFolder } from "./data/folder.js"
import { WindowActions } from "./window-action";
import * as WindowEnum from "../windows/window-enum.js"
import { uploads } from "../utils/upload/manager";
export const state = reactive({
    desktopScale: true,
    positionX: 0,
    positionY: 0,
    actionWindowId: -1,
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
export const createWindowByType = (windowType, data={}) => {
    let newWindow = Object.assign(new WindowEnum.BaseWindow(), new windowType(data));
    newWindow.id = randId();
    return newWindow;
}
class CoolWindowStarter {

    openStarter = () => {
        //如果启动器已经显示
        if (state.appStarterVisible) {
            wact.hideWindow(false);
        } else {
            wact.hideWindow(true);
        }
        state.appStarterVisible = !state.appStarterVisible;
    };

    //打开文件夹
    openNewFolder = (path = "/") => {
        let window = createWindowByType(WindowEnum.Folder, createFolder(path, []))
        startNewWindow(window)
    };
    openFileUploadManager = () => {
        let window = createWindowByType(WindowEnum.UploadManager,uploads)
        startNewWindow(window)
    };
    startNewErrorMessageDialog = (msg) => {
        let window = createWindowByType(WindowEnum.ErrorMessage, { "message": msg })
        startNewWindow(window)
    }

    startNewSuccessMessageDialog = (msg) => {
        let window = createWindowByType(WindowEnum.SuccessMessage, { "message": msg })
        startNewWindow(window)
    }
    

}
export const coolWindow = new CoolWindowStarter();
export const wact = new WindowActions();