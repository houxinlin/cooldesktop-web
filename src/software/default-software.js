import { coolWindow } from "../windows/window-manager.js";
let defaultAppList = [
    {
        name: "文件",
        icon: new URL(`../assets/icon/ic-folder.png`, import.meta.url).href,
        action: () => {
            coolWindow.openNewFolder();
        },
    },
    {
        name: "文件上传管理器",
        icon: new URL(`../assets/icon/ic-upload-manager.png`, import.meta.url).href,
        action: () => {
            coolWindow.openFileUploadManager();
        },
    },
    {
        name: "终端",
        icon: new URL(`../assets/icon/ic-shell.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewTerminal();
        },

    },
    {
        name: "软件商店",
        icon: new URL(`../assets/icon/ic-software.png`, import.meta.url).href,
        action: () => {
            coolWindow.startSoftware();
        },

    },
    {
        name: "系统设置",
        icon: new URL(`../assets/icon/ic-setting.png`, import.meta.url).href,
        action: () => {
            coolWindow.startSetting()
        },

    }, {
        name: "自定义软件",
        icon: new URL(`../assets/icon/ic-custom.png`, import.meta.url).href,
        action: () => {
            coolWindow.startCustomApplication()
        },

    },
    {
        name: "开发文档",
        icon: new URL(`../assets/icon/ic-developer.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewDeveloperDoc()
        },

    },
];
export default defaultAppList