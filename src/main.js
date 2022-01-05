import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
(window ).global = window;

const app =createApp(App)
app.use(router)
app.mount('#app')
