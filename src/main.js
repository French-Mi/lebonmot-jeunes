import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/appStore'

// Diese Zeile verursacht den Fehler, wenn die Datei nicht existiert.
// Nachdem du sie erstellt hast, sollte es funktionieren.
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const appStore = useAppStore()
appStore.loadProgress()
