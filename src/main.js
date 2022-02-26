import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
(window).global = window;
import mitt from "mitt"
const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.globalProperties.eventBus = new mitt()
