<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router';
import { achievements } from '@/data/achievements.js';
import AchievementIcon from '@/components/AchievementIcon.vue';
import ProgressChart from '@/components/ProgressChart.vue';

const appStore = useAppStore();
const router = useRouter();

const searchQueryLocal = ref('');
const selectedTimeFrame = ref('week');

const levelNames = computed(() => appStore.levelNames);
const levelInfo = computed(() => appStore.levelInfo);
const unlockedAchievements = computed(() => {
  return appStore.learningProgress.achievements.map(id => achievements[id]).filter(Boolean);
});
const searchResults = computed(() => appStore.searchResults);
const searchPerformed = computed(() => appStore.searchPerformed);

function startReview(days) {
  const quizStarted = appStore.startGlobalReview(days);
  if (quizStarted) {
    router.push({ name: 'quiz' });
  }
}

function executeSearch() {
  appStore.performSearch(searchQueryLocal.value);
}

function clearSearch() {
  searchQueryLocal.value = '';
  appStore.clearSearch();
}

function navigateToContext(contextString) {
  const parts = contextString.split(' > ');
  if (parts.length < 2) return;
  const level = parts[0];
  const mainChapter = parts.length === 3 ? parts[1] : null;
  const chapter = parts.length === 3 ? parts[2] : parts[1];
  appStore.selectLevel(level);
  appStore.selectMainChapter(mainChapter);
  appStore.selectChapter(chapter);
  router.push({ name: 'vocabulary-list' });
  clearSearch();
}
</script>

<template>
  <div>
    <div class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 class="text-xl font-semibold text-slate-700 mb-3 text-center">Vokabelsuche</h3>
      <div class="flex gap-2">
        <input
          type="text"
          v-model="searchQueryLocal"
          @keyup.enter="executeSearch"
          placeholder="Wort eingeben..."
          class="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button @click="executeSearch" class="btn btn-primary">Suchen</button>
        <button v-if="searchPerformed" @click="clearSearch" class="btn btn-neutral">X</button>
      </div>
    </div>

    <div v-if="searchPerformed" class="mb-8">
        <div v-if="searchResults.length > 0">
            <h4 class="text-lg font-semibold text-slate-600 mb-3">
                {{ searchResults.length }} {{ searchResults.length === 1 ? 'Ergebnis' : 'Ergebnisse' }} gefunden:
            </h4>
            <div class="space-y-3">
                <div v-for="(result, index) in searchResults" :key="index" class="search-result-item">
                    <p>
                        <strong class="text-blue-700">{{ result.french }}</strong> <br>
                        <span class="text-gray-700">{{ result.german }}</span>
                    </p>
                    <p v-if="result.exampleFrench" class="text-xs text-gray-500 italic mt-1">
                        Beispiel: "{{ result.exampleFrench }}"
                    </p>
                    <div class="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-2">
                        Gefunden in:
                        <button @click="navigateToContext(result.context)" class="context-link">
                           {{ result.context }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            Keine Vokabel für "{{ appStore.searchQuery }}" gefunden.
        </div>
    </div>


    <div class="text-center">
      <h2 class="text-2xl font-bold text-slate-800 mb-2">Willkommen bei le BonMot!</h2>
      <p class="text-slate-600 mb-6">Bitte wähle dein Niveau aus, um zu starten.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink v-for="level in levelNames" :key="level" :to="`/level/${level}`" class="btn btn-level">
          {{ level }}
        </RouterLink>
      </div>
    </div>

    <div class="mt-10 pt-6 border-t border-gray-200">
      <h3 class="text-xl font-semibold text-slate-700 mb-4 text-center">Fehler wiederholen</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <button @click="startReview(1)" class="btn btn-secondary">Fehler der letzten 24h</button>
        <button @click="startReview(7)" class="btn btn-secondary">Fehler der letzten 7 Tage</button>
      </div>
    </div>

    <div class="mt-10 pt-6 border-t border-gray-200">
      <h3 class="text-xl font-semibold text-slate-700 mb-4 text-center">Dein Fortschritt</h3>
      <div class="max-w-xl mx-auto">
        <p class="font-bold text-lg mb-2">Level {{ levelInfo.level }}</p>
        <div class="flex justify-between mb-1 text-sm text-gray-600">
          <span>XP: {{ levelInfo.currentLevelXp }} / {{ levelInfo.xpForNextLevel }}</span>
          <span>{{ levelInfo.progressPercentage }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div class="bg-blue-600 h-4 rounded-full" :style="{ width: levelInfo.progressPercentage + '%' }"></div>
        </div>

        <div class="mt-8 text-center bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p class="text-lg text-gray-800">
                🔥 Du hast <strong>{{ appStore.learningProgress.streak.current }}</strong> Tage in Folge gelernt!
            </p>
            <div class="mt-6">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-md font-semibold text-slate-600">Lernaktivität</h4>
                    <select v-model="selectedTimeFrame" class="p-1 border border-gray-300 rounded-md text-sm">
                        <option value="week">Woche</option>
                        <option value="month">Monat</option>
                        <option value="year">Jahr</option>
                    </select>
                </div>
                <ProgressChart
                    :chart-data="appStore.learningProgress.dailyVocabCount || {}"
                    :time-frame="selectedTimeFrame"
                />
            </div>
        </div>
      </div>

      <div class="mt-8" v-if="unlockedAchievements.length > 0">
        <h4 class="text-lg font-semibold text-slate-700 mb-4 text-center">Auszeichnungen</h4>
        <div class="flex flex-wrap justify-center gap-4">
          <AchievementIcon v-for="ach in unlockedAchievements" :key="ach.id" :achievement="ach" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn { display: flex; justify-content: center; align-items: center; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; font-weight: 500; text-align: center; text-decoration: none; transition: all 0.2s; border: 1px solid; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.btn-level { padding: 1rem 1.5rem !important; font-size: 1.1rem !important; background-color: #e7f1ff !important; color: #0d6efd !important; border-color: #0d6efd !important; }
.btn-level:hover { background-color: #dbeaff !important; }
.btn-secondary { background-color: #6c757d; color: white; border-color: #6c757d; }
.btn-secondary:hover { background-color: #5a6268; border-color: #545b62; }
.btn-primary { background-color: #3b82f6; color: white; padding: 0.5rem 1rem; border: none;}
.btn-neutral { background-color: #ef4444; color: white; padding: 0.5rem 1rem; border: none; }
.search-result-item {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: white;
}
.context-link {
    background: none;
    border: none;
    padding: 0;
    color: #3b82f6;
    text-decoration: none;
    cursor: pointer;
}
.context-link:hover {
    text-decoration: underline;
}
</style>
