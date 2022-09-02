import Stomp from "stompjs";
import {getSystemAddressByKey} from "../utils/utils.js";
/**
 * WebSocket创建
 */
export default (subscribe, socketMessageCallback, websocketCloseCallback) => {
    let url = `${getSystemAddressByKey("host")}desktop-socket-endpoint`;

    let stompClient = Stomp.over(new SockJS(url));
    //连接成功则订阅
    let client = stompClient.connect({}, () => {
        stompClient.subscribe(subscribe, (e) => { socketMessageCallback(e) });
    }, websocketCloseCallback);

    stompClient.debug = null;

    return stompClient;

}