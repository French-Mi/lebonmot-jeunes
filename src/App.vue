<script setup>
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router'
import NotificationToast from '@/components/NotificationToast.vue';

// NEU: Zustand für die Sichtbarkeit des Splash Screens
const showSplash = ref(true);

// NEU: Logik, um den Splash Screen nach 3 Sekunden auszublenden
onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;
  }, 3000);
});

// NEU: Funktion, um den Splash Screen bei Klick auszublenden
function hideSplash() {
  showSplash.value = false;
}
</script>

<template>
  <div v-if="showSplash" class="splash-screen" @click="hideSplash">
    <svg class="splash-logo" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="flag-clip"><rect x="108" y="80.5" width="84" height="54" rx="5" ry="5" /></clipPath></defs><rect width="300" height="300" rx="45" ry="45" fill="#3A6EA5" /><g id="speech-bubble"><rect x="90" y="62.5" width="120" height="90" rx="28" ry="28" fill="white" /><polygon points="120,152 140,152 130,167" fill="white" /></g><g id="flag" clip-path="url(#flag-clip)"><rect x="108" y="80.5" width="28" height="54" fill="#0055A4" /><rect x="136" y="80.5" width="28" height="54" fill="#FFFFFF" /><rect x="164" y="80.5" width="28" height="54" fill="#EF4135"/></g><rect x="108" y="80.5" width="84" height="54" rx="5" ry="5" fill="none" stroke="#ccc" stroke-width="1"/><text x="150" y="230" font-family="Georgia, serif" font-size="45px" font-weight="bold" fill="white" text-anchor="middle">le BonMot</text></svg>
  </div>

  <div v-else class="app-shell-container">
    <NotificationToast />
    <div class="app-shell">
      <header class="header">
        <svg class="header-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M85 22.0001C85 18.1341 81.866 15.0001 78 15.0001H22C18.134 15.0001 15 18.1341 15 22.0001V62.0001C15 65.8661 18.134 69.0001 22 69.0001H35V81.0001L50.5 69.0001H78C81.866 69.0001 85 65.8661 85 62.0001V22.0001Z" fill="white"/><rect x="25" y="25.0001" width="16.6667" height="34" fill="#0055A4"/><rect x="41.6667" y="25.0001" width="16.6666" height="34" fill="white"/><rect x="58.3333" y="25.0001" width="16.6667" height="34" fill="#EF4135"/></svg>
        <div>
          <h1>le BonMot</h1>
          <p class="header-subtitle">Vokabeltrainer</p>
        </div>
      </header>

      <main class="main-app-content">
        <RouterView />
      </main>

      <footer class="text-center text-xs text-gray-500 py-3 px-4 border-t border-gray-200 flex-shrink-0">
          &copy; Miriam Betz, 2025. Alle Rechte vorbehalten.
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* NEUE STILE für den Splash Screen */
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #4A90E2;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    cursor: pointer;
}
.splash-logo {
    width: 250px;
    height: 250px;
    animation: fadeInLogo 1.5s ease-in-out;
}
@keyframes fadeInLogo {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
}

/* Bestehende Stile */
.app-shell-container {
    width: 100%;
    min-height: 100vh;
    padding: 2rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.app-shell {
    background-color: #ffffff;
    width: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    height: calc(100vh - 4rem);
    max-height: calc(100vh - 4rem);
    overflow: hidden;
}
.main-app-content {
    padding: 1.5rem;
    flex-grow: 1;
    overflow-y: auto;
    scrollbar-gutter: stable;
}
.header { background-color: #4A90E2; color: white; padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.header .header-logo-svg { width: 40px; height: 40px; margin-right: 12px; }
.header h1 { font-family: 'Merriweather', serif; font-size: 2rem; font-weight: 700; line-height: 1.1; }
.header .header-subtitle { font-size: 0.875rem; opacity: 0.9; margin-top: 0.25rem; text-align: left; }
footer { flex-shrink: 0; }

@media (min-width: 840px) {
  .app-shell {
    width: 800px;
  }
}
</style>
