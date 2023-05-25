import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css'
import './assets/styles.scss'
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
const options : PluginOptions = {}
app.use(Toast, options);
app.mount('#app')
