import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {setAddressConfig} from "./utils/utils.js";

(window).global = window;
import mitt from "mitt"
const app = createApp(App)
app.config.globalProperties.eventBus = new mitt()

if(import.meta.env.VITE_APP_ENV=="DEV"){

    let addressConfig={};
    addressConfig.host=import.meta.env.VITE_APP_REQUEST_URL;
    addressConfig.websocket=import.meta.env.VITE_APP_WEBSOCKET;
    addressConfig.softwareServer=import.meta.env.VITE_APP_SOFTWARE_SERVER_URL;
    addressConfig.terminalSocket=import.meta.env.VITE_APP_TERMINAL_WEBSOCKET;
    setAddressConfig(addressConfig);
}
if(import.meta.env.VITE_APP_ENV=="PROD"){
    let addressConfig={};
    addressConfig.host=location.protocol + "//"+  location.host +"/";
    addressConfig.websocket= location.protocol+"//"+ location.host+"/wbs";
    addressConfig.softwareServer=import.meta.env.VITE_APP_SOFTWARE_SERVER_URL
    addressConfig.terminalSocket="ws:"+"//"+location.host+"/ws/websocket/terminal";
    setAddressConfig(addressConfig);
}
app.use(router)
app.mount('#app')

