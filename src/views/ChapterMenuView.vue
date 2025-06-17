<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const router = useRouter();

// KORRIGIERT: Zeigt jetzt immer nur den finalen Kapiteltitel an
const chapterTitle = computed(() => {
  return appStore.selectedChapter || 'Kapitel';
});

function showVocabList() {
  router.push({ name: 'vocabulary-list' });
}

function startLearning() {
  router.push({ name: 'learn-options' });
}

function goBack() {
  router.go(-1);
}
</script>

<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">{{ chapterTitle }}</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      <button @click="showVocabList" class="btn btn-vocablist">
        Vokabelliste anzeigen
      </button>
      <button @click="startLearning" class="btn btn-learn">
        Lernen starten
      </button>
    </div>

    <button @click="goBack" class="btn btn-back mt-6 w-full max-w-md mx-auto">
      Zurück zur Kapitelauswahl
    </button>
  </div>
</template>

<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.1);
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.btn-vocablist {
  background-color: #e0e7ff;
  color: black !important;
  border-color: #c7d2fe;
}
.btn-vocablist:hover {
  background-color: #c7d2fe;
}

.btn-learn {
  background-color: #d1fae5;
  color: black !important;
  border-color: #a7f3d0;
}
.btn-learn:hover {
  background-color: #a7f3d0;
}

.btn-back {
  background-color: #fee2e2;
  color: black !important;
  border-color: #fecaca;
  max-width: 400px;
}
.btn-back:hover {
  background-color: #fecaca;
}
</style>
