import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();

const notification = (param) => {
    setNotification(param);
};

window.addEventListener("message", (events) => {
    if (events.data.action == "notification") {
        notification(events.data.param);
        return;
    }
});