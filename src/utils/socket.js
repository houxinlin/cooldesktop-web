import Stomp from "stompjs";
export default (subscribe, socketMessage, websocketClose) => {
    let url = `${import.meta.env.VITE_APP_REQUEST_URL}desktop-socket-endpoint`;

    let stompClient = Stomp.over(new SockJS(url));
    stompClient.connect({}, () => { stompClient.subscribe(subscribe, (e)=>{
        socketMessage(e)
    }); }, websocketClose);
    stompClient.debug = null;
}