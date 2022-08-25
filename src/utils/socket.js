import Stomp from "stompjs";
/**
 * WebSocket创建
 */
export default (subscribe, socketMessageCallback, websocketCloseCallback) => {
    let url = `${import.meta.env.VITE_APP_REQUEST_URL}desktop-socket-endpoint`;

    let stompClient = Stomp.over(new SockJS(url));
    //连接成功则订阅
    let client = stompClient.connect({}, () => {
        stompClient.subscribe(subscribe, (e) => { socketMessageCallback(e) });
    }, websocketCloseCallback);

    stompClient.debug = null;

    return stompClient;

}