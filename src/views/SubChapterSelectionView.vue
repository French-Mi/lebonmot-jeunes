<script setup>
import { computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const router = useRouter()

// Stellt sicher, dass ein Hauptkapitel ausgewählt ist. Wenn nicht, zurück zur Kapitelauswahl.
onBeforeMount(() => {
  if (!store.selectedLevel || !store.selectedMainChapter) {
    router.push('/chapter-selection')
  }
})

// Holt die Liste der Unterkapitel dynamisch aus dem Store.
const subChapters = computed(() => {
  if (!store.selectedLevel || !store.selectedMainChapter) return {}
  return store.vocabDataGlobal[store.selectedLevel][store.selectedMainChapter]
})

// Wählt ein Unterkapitel aus und navigiert zum Kapitelmenü.
function selectSubChapter(subChapterName) {
  store.selectedChapter = subChapterName
  router.push('/chapter-menu')
}

// Navigiert eine Ebene zurück.
function goBack() {
  store.selectedMainChapter = null
  router.push('/chapter-selection')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-2">Hauptkapitel: {{ store.selectedMainChapter }}</h2>
    <p class="text-slate-600 mb-6">Wähle ein Unterkapitel aus.</p>

    <div class="space-y-3">
      <button
        v-for="(data, subChapterName) in subChapters"
        :key="subChapterName"
        @click="selectSubChapter(subChapterName)"
        class="w-full text-left p-4 rounded-lg shadow-sm transition-colors duration-200 bg-white hover:bg-gray-100">
        {{ subChapterName }}
        <!-- Hier kann später eine Fortschrittsanzeige (Häkchen) hinzukommen -->
      </button>
    </div>

    <button @click="goBack" class="btn btn-neutral mt-6">Zurück zur Kapitelauswahl</button>
  </div>
</template>
