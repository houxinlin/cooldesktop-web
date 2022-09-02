import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();
import { coolWindow } from "../../windows/window-manager.js";

import { getApplicationById } from "../application.js"
const notification = (param) => {
    setNotification(param);
};
const createFileSelectCallback = (events) => {
    return (data) => {
        events.source.postMessage(JSON.stringify(data), "*")
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
    if (events.data.action == "open-application") {
        let application = getApplicationById(events.data.param.applicationId);
        if (application == null) return
        let property = events.data.param.property || {}
        coolWindow.startNewWebView(application, null, events.data.param.page,property)
    }
});
