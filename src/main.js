import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'

import './styles.css' // если есть глобальные стили

const app = createApp(App)

app.use(router)

app.mount('#app')
