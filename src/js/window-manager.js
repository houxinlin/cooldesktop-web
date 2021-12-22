// import { randId } from "../utils/utils";
// import { standardWindow, folderWindow, errorMessageWindow, successMessageWindow } from "./window-property";
// import { reactive } from "vue";
// import * as folderManager from "./folder-manager.js";
// let actionMoveId = '';
// export const state = reactive({
//     desktopScale: true,
//     positionX: 0,
//     positionY: 0,
//     actionWindowId: -1,
//     //窗口集合
//     windowsCollection: [],
//     appStarterVisible: false,
//     windowVisibleState: [],
// });;
// const startNewWindow = (windowProperty = {}) => {
//     let newProperty = {};
//     Object.assign(newProperty, standardWindow.getProperty(), windowProperty);
//     newProperty.id = randId();
//     newProperty.actionWindow = true;
//     state.actionWindowId = newProperty.id;
//     state.windowsCollection.push(newProperty);

// }

// export const startNewErrorMessageDialog = (msg) => {
//     let errorProperty = errorMessageWindow.getProperty();
//     errorProperty.error = { "message": msg }
//     openNewWindow(errorProperty)
// }

// export const startNewSuccessMessageDialog = (msg) => {
//     let errorProperty = successMessageWindow.getProperty();
//     errorProperty.error = { "message": msg }
//     openNewWindow(errorProperty)
// }
// export const hideWindow = (status) => {
//     if (status) {
//         state.windowVisibleState = state.windowsCollection.filter(
//             (item) => item.hideWindow == true
//         );
//         console.log(state.windowVisibleState)
//         for (const iterator of state.windowsCollection) {
//             iterator.hideWindow = true;
//         }
//         return
//     }
//     for (const iterator of state.windowsCollection) {
//         iterator.hideWindow = false;
//     }
// };

// export const setWindowPos = (id) => {
//     console.log(state)
//     for (const item of state.windowsCollection) {
//         item.actionWindow = false;
//     }

//     //当前活动id
//     state.actionWindowId = id;
//     //设置当前为置顶
//     getAppById(id).instance.actionWindow = true;
//     //如果是最小化的时候，则显示
//     if (getAppById(id).instance.minState) {
//         getAppById(id).instance.minState = false;
//         return;
//     }
// };
// export const getAppById = (id) => {
//     console.log(state.windowsCollection)
//     let index = state.windowsCollection.findIndex((item) => item.id == id);
//     return {
//         instance: state.windowsCollection[index],
//         index: index,
//     };
// };
// export const windowMouseUp = (e, b) => {
//     for (const item of state.windowsCollection) {
//         item.pointerEvents = false;
//     }
// };


// //打开新窗口
// export const openNewWindow = (windowProperty = {}) => {
//     state.appStarterVisible = false;
//     hideWindow(false)
//     startNewWindow(windowProperty);
// };
// //打开文件夹
// export const openNewFolder = (path = "/") => {
//     let newFolder = folderManager.createFolder(path, []);
//     let folderProperty = folderManager.getFolderWindowProperty(newFolder);
//     openNewWindow(folderProperty);
// };

// //打开web
// export const openNewApp = (url) => {
//     openNewWindow({ url: url, icon: "/src/assets/icon/ic-folder.png" });
// };

// //显示Window
// export const showWindow = (id) => {
//     //如果起动器是显示状态
//     if (state.appStarterVisible) {
//         hideWindow(false);
//         state.appStarterVisible = false;
//         return;
//     }
//     //如果当前Window已经显示，并且是置顶，则开始动画
//     if (getAppById(id).instance.actionWindow == true) {
//         getAppById(id).instance.windowScale = true;

//         setTimeout(() => {
//             getAppById(id).instance.windowScale = false;
//         }, 301);
//         return;
//     }
//     if (getAppById(id).instance.minState) {
//         getAppById(id).instance.minState = false;
//     }
//     //显示Window
//     setWindowPos(id);
// };

// //最小化
// export const windowMin = (id) => {
//     getAppById(id).instance.minState = !getAppById(id).instance.minState;
//     getAppById(id).instance.actionWindow = false;
//     state.actionWindowId = -1;
// };
// //关闭Window
// export const closeWindow = (id) => {
//     getAppById(id).instance.closeWindowTransition = true;
//     setTimeout(() => {
//         state.windowsCollection.splice(getAppById(id).index, 1);
//         state.actionWindowId = -1;
//     }, 200);
// };
// //全屏
// export const windowFullScreen = (id) => {
//     for (const item of state.windowsCollection) {
//         item.pointerEvents = true;
//     }
//     let app = getAppById(id);
//     if (app.instance.maxState) {
//         app.instance.maxState = !app.instance.maxState;
//         setTimeout(() => {
//             app.instance.windowTransition = !app.instance.windowTransition;
//             for (const item of state.windowsCollection) {
//                 item.pointerEvents = false;
//             }
//         }, 500);
//     } else {
//         app.instance.windowTransition = !app.instance.windowTransition;
//         setTimeout(() => {
//             app.instance.maxState = !app.instance.maxState;
//             for (const item of state.windowsCollection) {
//                 item.pointerEvents = false;
//             }
//         }, 10);
//     }
// };

// export const openStarter = () => {
//     //如果启动器已经显示
//     if (state.appStarterVisible) {
//         hideWindow(false);
//     } else {
//         hideWindow(true);
//     }
//     state.appStarterVisible = !state.appStarterVisible;
// };



// export const windowMove = (e) => {

//     if (e.which == 3) {
//         return;
//     }
//     for (const item of state.windowsCollection) {
//         item.pointerEvents = true;
//     }
//     let odiv = e.target;
//     let downDiv = odiv;
//     let list = [];

//     //找到window-item节点
//     while (list.findIndex((item) => item == "window-item") == -1) {
//         odiv = odiv.parentNode;
//         let classList = odiv.classList;
//         if (classList == undefined) {
//             return;
//         }
//         list = [...classList];
//     }
//     actionMoveId = odiv.getAttribute("data-id");


//     //置顶
//     odiv.style.zIndex = 9999;
//     for (const item of document.querySelectorAll(".window-item")) {
//         if (item != odiv) {
//             item.style.zIndex = 1000;
//         }
//     }

//     //除了window-body其他都可以移动
//     if (
//         [...downDiv.classList].findIndex((item) => item == "window-title") == -1
//     ) {
//         if (downDiv.nodeName != "HEADER") {
//             return;
//         }
//     }
//     let disX = e.clientX - odiv.offsetLeft;
//     let disY = e.clientY - odiv.offsetTop;
//     document.onmousemove = (e) => {
//         let left = e.clientX - disX;
//         let top = e.clientY - disY;
//         if (top <= -10) {
//             document.onmousemove = null;
//             document.onmouseup = null;
//             windowFullScreen(actionMoveId);
//             return
//         }
//         odiv.style.left = left + "px";
//         odiv.style.top = top + "px";
//     };
//     document.onmouseup = (e) => {
//         document.onmousemove = null;
//         document.onmouseup = null;
//     };
// };