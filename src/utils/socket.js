import Stomp from "stompjs";
/**
 * WebSocket创建
 */
export default (subscribe, socketMessage, websocketClose) => {
    let url = `${import.meta.env.VITE_APP_REQUEST_URL}desktop-socket-endpoint`;

    let stompClient = Stomp.over(new SockJS(url));
    //连接成功则订阅
    stompClient.connect({}, () => { stompClient.subscribe(subscribe, (e)=>{
        socketMessage(e)
    }); }, websocketClose);
    stompClient.debug = null;
}