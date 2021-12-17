import { randId } from "../utils/utils";
import { standardWindow, folderWindow } from "./window-property";
import { reactive } from "vue";
import * as folderManager from "./folder-manager.js";
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

export const startNewWindow = ( windowProperty = {}) => {
    let newProperty = {};
    /**
     * 生成新的属性
     */
    Object.assign(newProperty, standardWindow.getProperty(), windowProperty);
    /**
     * 创建唯一id
     */
    newProperty.id = randId();
    /**
     * 是否活动
     */
    newProperty.actionWindow = true;
    /**
     * 当前活动窗口id
     */
    state.actionWindowId = newProperty.id;

    /**
     * 启动器不可见
     * 
     * s
     */
    state.appStarterVisible = false;

    state.windowsCollection.push(newProperty);

    console.log(windowProperty)

}

export const hideWindow = (status) => {
    if (status) {
        state.windowVisibleState = state.windowsCollection.filter(
            (item) => item.hideWindow == true
        );
        console.log(state.windowVisibleState)
        for (const iterator of state.windowsCollection) {
            iterator.hideWindow = true;
        }
        return
    }
    for (const iterator of state.windowsCollection) {
        iterator.hideWindow = false;
    }
};

export const setWindowPos = (id) => {
    console.log(state)
    for (const item of state.windowsCollection) {
        item.actionWindow = false;
    }

    //当前活动id
    state.actionWindowId = id;
    //设置当前为置顶
    getAppById(id).instance.actionWindow = true;
    //如果是最小化的时候，则显示
    if (getAppById(id).instance.minState) {
        getAppById(id).instance.minState = false;
        return;
    }
};
export const getAppById = (id) => {
    let index = state.windowsCollection.findIndex((item) => item.id == id);
    return {
        instance: state.windowsCollection[index],
        index: index,
    };
};
export const windowMouseUp = (e, b) => {
    for (const item of state.windowsCollection) {
        item.pointerEvents = false;
    }
};


//打开新窗口
export const openNewWindow = (windowProperty = {}) => {
    hideWindow(false)
    startNewWindow( windowProperty);
};
//打开文件夹
export const openNewFolder = () => {
    let newFolder = folderManager.createFolder("/a", []);
    let folderProperty = folderManager.addFolder(newFolder);
    openNewWindow(folderProperty);
};
//打开web
export const openNewApp = (url) => {
    openNewWindow({ url: url, icon: "/src/assets/icon/ic-folder.png" });
};

//显示Window
export const showWindow = (id) => {
    //如果起动器是显示状态
    if (state.appStarterVisible) {
        hideWindow(false);
        state.appStarterVisible = false;
        return;
    }
    //如果当前Window已经显示，并且是置顶，则开始动画
    if (getAppById(id).instance.actionWindow == true) {
        getAppById(id).instance.windowScale = true;

        setTimeout(() => {
            getAppById(id).instance.windowScale = false;
        }, 301);
        return;
    }
    if (getAppById(id).instance.minState) {
        getAppById(id).instance.minState = false;
    }
    //显示Window
    setWindowPos(id);
};

//最小化
export const windowMin = (id) => {
    getAppById(id).instance.minState = !getAppById(id).instance.minState;
    getAppById(id).instance.actionWindow = false;
    state.actionWindowId = -1;
};
//关闭Window
export const closeWindow = (id) => {
    folderManager.addFolder();
    getAppById(id).instance.closeWindowTransition = true;
    setTimeout(() => {
        state.windowsCollection.splice(getAppById(id).index, 1);
        state.actionWindowId = -1;
    }, 200);
};
//全屏
export const windowFullScreen = (id) => {
    for (const item of state.windowsCollection) {
        item.pointerEvents = true;
    }
    let app = getAppById(id);
    if (app.instance.maxState) {
        app.instance.maxState = !app.instance.maxState;
        setTimeout(() => {
            app.instance.windowTransition = !app.instance.windowTransition;
            for (const item of state.windowsCollection) {
                item.pointerEvents = false;
            }
        }, 500);
    } else {
        app.instance.windowTransition = !app.instance.windowTransition;
        setTimeout(() => {
            app.instance.maxState = !app.instance.maxState;
            for (const item of state.windowsCollection) {
                item.pointerEvents = false;
            }
        }, 10);
    }
};

export const openStarter = () => {

    //如果启动器已经显示
    if (state.appStarterVisible) {
        hideWindow(false);
    } else {
        hideWindow(true);
    }
    state.appStarterVisible = !state.appStarterVisible;
};