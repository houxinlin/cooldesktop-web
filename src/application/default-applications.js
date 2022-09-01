import { coolWindow } from "../windows/window-manager.js";
let defaultAppList = [
    {
        visibilityIsDesktop: true,
        name: "文件",
        icon: new URL(`../assets/icon/ic-folder.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewFolder();
        },
    },
    {
        visibilityIsDesktop: true,
        name: "文件上传管理器",
        icon: new URL(`../assets/icon/ic-upload-manager.png`, import.meta.url).href,
        action: () => {
            coolWindow.startFileUploadManager();
        },
    },
    {
        visibilityIsDesktop: true,
        name: "终端",
        icon: new URL(`../assets/icon/ic-shell.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewTerminal();
        },

    },
    {
        visibilityIsDesktop: true,
        name: "软件商店",
        icon: new URL(`../assets/icon/ic-software.png`, import.meta.url).href,
        action: () => {
            coolWindow.startSoftware();
        },

    },
    {
        visibilityIsDesktop: true,
        name: "系统设置",
        icon: new URL(`../assets/icon/ic-setting.png`, import.meta.url).href,
        action: () => {
            coolWindow.startSetting();
        },

    }, {
        visibilityIsDesktop: true,
        name: "自定义软件",
        icon: new URL(`../assets/icon/ic-custom.png`, import.meta.url).href,
        action: () => {
            coolWindow.startCustomApplication();
        },

    },
    {
        visibilityIsDesktop: true,
        name: "开发文档",
        icon: new URL(`../assets/icon/ic-developer.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewDeveloperDoc();
        },

    },
    {
        visibilityIsDesktop: false,
        name: "追踪日志",
        icon: new URL(`../assets/icon/ic-log.png`, import.meta.url).href,
        action: () => {
            coolWindow.startTail();
        },

    },
    {
        visibilityIsDesktop: true,
        name: "系统日志",
        icon: new URL(`../assets/icon/ic-sys-log.png`, import.meta.url).href,
        action: () => {
            coolWindow.startSysLog();
        },

    },    {
        visibilityIsDesktop: true,
        name: "共享链接",
        icon: new URL(`../assets/icon/ic-share-lilnk.png`, import.meta.url).href,
        action: () => {
            coolWindow.startNewShareLinkList();
        },

    }


    
];
export default defaultAppList