import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// KORRIGIERTER IMPORT: Lädt den Router aus der index.js im 'router'-Ordner.
import router from './router/index.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
