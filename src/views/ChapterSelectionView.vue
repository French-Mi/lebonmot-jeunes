<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';

const props = defineProps({
  levelName: {
    type: String,
    required: true
  }
});

const appStore = useAppStore();
const router = useRouter();

const selectedMainChapter = ref(null);

appStore.selectLevel(props.levelName);

const levelData = computed(() => appStore.vocabDataGlobal[props.levelName]);

const chapters = computed(() => {
  if (!levelData.value) return [];
  if (selectedMainChapter.value) {
    return Object.keys(levelData.value[selectedMainChapter.value]).map(key => ({ name: key, isMain: false, mainChapter: selectedMainChapter.value }));
  }
  return Object.keys(levelData.value).map(key => ({
    name: key,
    isMain: !Array.isArray(levelData.value[key])
  }));
});

const viewTitle = computed(() => {
    if (props.levelName === 'Lektüren' && selectedMainChapter.value) {
        return selectedMainChapter.value;
    }
    if (selectedMainChapter.value) {
        return `Level: ${props.levelName}: ${selectedMainChapter.value}`;
    }
    return `Level: ${props.levelName}`;
});


function getChapterStatusClass(chapter) {
    if (appStore.isChapterCompleted(props.levelName, chapter.name, chapter.mainChapter)) {
        return 'status-completed';
    }
    if (appStore.isChapterStarted(props.levelName, chapter.name, chapter.mainChapter)) {
        return 'status-started';
    }
    return 'status-default';
}

function handleChapterClick(chapter) {
  if (chapter.isMain) {
    selectedMainChapter.value = chapter.name;
    appStore.selectMainChapter(chapter.name);
  } else {
    if (chapter.mainChapter) {
        appStore.selectMainChapter(chapter.mainChapter);
    }
    appStore.selectChapter(chapter.name);
    router.push({ name: 'chapter-menu' });
  }
}

function goBack() {
  if (selectedMainChapter.value) {
    selectedMainChapter.value = null;
    appStore.selectMainChapter(null);
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-slate-800 mb-4">
      {{ viewTitle }}
    </h2>
    <p class="text-slate-600 mb-6">Wähle ein Kapitel aus.</p>

    <div class="space-y-3">
      <button
        v-for="chapter in chapters"
        :key="chapter.name"
        @click="handleChapterClick(chapter)"
        class="chapter-btn"
        :class="getChapterStatusClass(chapter)"
      >
        {{ chapter.name }}
      </button>
    </div>

    <button @click="goBack" class="btn btn-neutral mt-6">
      Zurück
    </button>
  </div>
</template>

<style scoped>
.btn {
    display: inline-block; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; background-color: #6c757d; color: white;
    font-size: 1rem; font-weight: 500; cursor: pointer; text-align: center; text-decoration: none; transition: background-color 0.2s;
}
.btn:hover { background-color: #5a6268; }
.btn-neutral { background-color: #6c757d !important; }
.btn-neutral:hover { background-color: #5a6268 !important; }

.chapter-btn {
    width: 100%;
    text-align: left;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.2s;
    font-weight: 500;
    border-width: 1px;
    border-style: solid;
}

.status-default {
    background-color: white;
    border-color: #e5e7eb;
}
.status-default:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
}

.status-started {
    background-color: #fef9c3;
    border-color: #fde047;
    color: #713f12;
}
.status-started:hover {
    background-color: #fef08a;
}

.status-completed {
    background-color: #dcfce7;
    border-color: #4ade80;
    color: #15803d;
}
.status-completed:hover {
    background-color: #bbf7d0;
}
</style>
