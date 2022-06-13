export const notifyMessage = (message, type) => {
    postMessage({ action: "notification", param: { message, type } });
};
