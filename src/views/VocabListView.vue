<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const router = useRouter();

const visibleExamples = ref({});
function toggleExample(index) {
  visibleExamples.value[index] = !visibleExamples.value[index];
}
const speakerIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline-block align-middle ml-1 w-5 h-5"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>`;
let frenchVoices = [];
const synth = window.speechSynthesis;
function loadVoices() { if (synth) { frenchVoices = synth.getVoices().filter(v => v.lang.startsWith('fr')); } }
function speak(text, event) { if (event) event.stopPropagation(); if (!synth || !text) return; const cleanedText = String(text).replace(/\(.*\)/gi, '').replace(/\b(qc|qn|qc à qn)\b\.?/gi, '').trim(); if (!cleanedText) return; if (synth.speaking) synth.cancel(); const utterance = new SpeechSynthesisUtterance(cleanedText); utterance.lang = 'fr-FR'; utterance.rate = 1.0; if (frenchVoices.length > 0) { utterance.voice = frenchVoices.find(v => v.default) || frenchVoices.find(v => v.name.includes('Amelie') || v.name.includes('Thomas')) || frenchVoices[0]; } utterance.onerror = (e) => { console.error("Fehler bei der Sprachsynthese:", e); alert(`Sprachausgabe fehlgeschlagen: ${e.error}.`); }; synth.speak(utterance); }
onMounted(() => { if (synth) { if (synth.getVoices().length > 0) { loadVoices(); } else if (synth.onvoiceschanged !== undefined) { synth.onvoiceschanged = loadVoices; } } });

// KORRIGIERT: Zeigt jetzt immer nur den finalen Kapiteltitel an
const chapterTitle = computed(() => {
  return appStore.selectedChapter || 'Kapitel';
});

const vocabList = computed(() => {
  const store = appStore;
  if (!store.selectedLevel || !store.selectedChapter) return [];
  try {
    if (store.selectedMainChapter) {
      return store.vocabDataGlobal[store.selectedLevel][store.selectedMainChapter][store.selectedChapter] || [];
    }
    return store.vocabDataGlobal[store.selectedLevel][store.selectedChapter] || [];
  } catch (e) {
    console.error("Fehler beim Abrufen der Vokabelliste:", e);
    return [];
  }
});

function startLearning() {
  router.push({ name: 'learn-options' });
}
function goToChapterSelection() {
    router.push({ name: 'chapter-selection', params: { levelName: appStore.selectedLevel } });
}
function goToHome() {
    router.push('/');
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-4">Vokabeln: {{ chapterTitle }}</h2>

    <div class="vocab-list-container">
      <ul class="divide-y divide-gray-200">
        <li v-if="vocabList.length === 0" class="p-4 text-center text-gray-500">
          Für dieses Kapitel wurden keine Vokabeln gefunden.
        </li>
        <li v-for="(vocab, index) in vocabList" :key="index" class="p-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-semibold text-gray-800">
                {{ vocab.french }}
                <button @click="speak(vocab.french, $event)" class="speaker-btn" v-html="speakerIconSvg"></button>
              </p>
              <p class="text-gray-600">{{ vocab.german }}</p>
            </div>
            <button v-if="vocab.exampleFrench" @click="toggleExample(index)" class="btn-example">
              {{ visibleExamples[index] ? 'Verbergen' : 'Beispiel' }}
            </button>
          </div>
          <div v-if="visibleExamples[index]" class="example-box mt-2">
            <p><strong>FR:</strong> {{ vocab.exampleFrench }} <button @click.stop="speak(vocab.exampleFrench, $event)" class="speaker-btn" v-html="speakerIconSvg"></button></p>
            <p><strong>DE:</strong> {{ vocab.exampleGerman }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-6 space-y-3">
        <button @click="startLearning" class="btn btn-primary w-full">Lernen starten</button>
        <button @click="goToChapterSelection" class="btn btn-secondary w-full">Zurück zur Kapitelwahl</button>
        <button @click="goToHome" class="btn-neutral w-full">Zurück zur Startseite</button>
    </div>
  </div>
</template>

<style scoped>
.vocab-list-container { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; max-height: 50vh; overflow-y: auto; }
.btn { width: 100%; max-width: 320px; margin: 0 auto; display: block; }
.btn-neutral { background-color: #6c757d; color: white; padding: 0.75rem; border-radius: 6px; border: none; transition: background-color 0.2s; font-weight: 500; }
.btn-neutral:hover { background-color: #5a6268; }
.btn-primary { background-color: #3A6EA5; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; border: none; font-weight: 500; }
.btn-secondary { background-color: #e5e7eb; color: #374151; font-weight: 500; padding: 0.75rem 1.5rem; border-radius: 6px; border: none; }
.example-box { background-color: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 0.75rem; font-size: 0.9rem; line-height: 1.5; }
.speaker-btn { background: none; border: none; padding: 0; margin: 0 0 0 0.25rem; cursor: pointer; color: #6b7280; display: inline-flex; align-items: center; vertical-align: middle; }
.speaker-btn:hover { color: #3b82f6; }
.btn-example { background-color: #e5e7eb; color: #374151; border: 1px solid #d1d5db; padding: 0.25rem 0.75rem; font-size: 0.8rem; border-radius: 9999px; white-space: nowrap; }
</style>
