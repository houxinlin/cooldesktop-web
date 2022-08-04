import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();
import { coolWindow } from "../../windows/window-manager.js";
const notification = (param) => {
    setNotification(param);
};
const createFileSelectCallback = (events) => {
    return (data) => {
        events.source.postMessage(JSON.stringify(data),"*")
    }
}
//所有iframe向这里发送msg，主程序处理
window.addEventListener("message", (events) => {
    if (events.data.action == "notification") {
        notification(events.data.param);
        return;
    }
    if (events.data.action == "selectFile") {
        coolWindow.startNewFileSelect(events.data.param.type || "file", createFileSelectCallback(events));
    }
});
