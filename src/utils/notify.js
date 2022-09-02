export const notifyMessage = (message, type="success") => {
    postMessage({ action: "notification", param: { message, type } });
};
