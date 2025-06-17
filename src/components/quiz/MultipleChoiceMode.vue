<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import ProgressBar from './ProgressBar.vue'
import { speakFrench } from '@/services/speechService.js'

const store = useAppStore()
const router = useRouter()

const feedbackText = ref('')
const isAnswered = ref(false)
const options = ref([])

const currentWord = computed(() => store.currentWord)

function generateOptions() {
    if (!currentWord.value) {
        options.value = [];
        return;
    }
    const correctAnswer = store.currentQuizDirection === 'frToDe' ? currentWord.value.german : currentWord.value.french;

    let sourceChapter;
    if (store.selectedMainChapter) {
        sourceChapter = store.vocabDataGlobal[store.selectedLevel][store.selectedMainChapter][store.selectedChapter];
    } else {
        sourceChapter = store.vocabDataGlobal[store.selectedLevel][store.selectedChapter];
    }

    if (!Array.isArray(sourceChapter)) {
        console.error("Vokabelquelle ist kein Array:", sourceChapter);
        options.value = [correctAnswer];
        return;
    }

    let distractors = sourceChapter
        .filter(word => (store.currentQuizDirection === 'frToDe' ? word.german : word.french) !== correctAnswer)
        .map(word => store.currentQuizDirection === 'frToDe' ? word.german : word.french);

    distractors = [...new Set(distractors)].sort(() => 0.5 - Math.random()).slice(0, 3);

    options.value = [...distractors, correctAnswer].sort(() => 0.5 - Math.random());
}

function checkAnswer(selectedOption) {
    if (isAnswered.value) return;

    isAnswered.value = true;
    const isCorrect = store.submitAnswer(selectedOption);

    if (isCorrect) {
        feedbackText.value = "Richtig!";
    } else {
        const correctAnswer = store.currentQuizDirection === 'frToDe' ? currentWord.value.german : currentWord.value.french;
        feedbackText.value = `Falsch. Richtig: ${correctAnswer}`;
    }
}

function next() {
    store.nextQuestion();
}

function quit() {
  store.quitQuiz();
  router.push('/');
}

watch(currentWord, () => {
    isAnswered.value = false;
    feedbackText.value = '';
    generateOptions();
}, { immediate: true });

watch(() => store.isQuizFinished, (isFinished) => {
  if (isFinished) {
    router.push('/quiz-end');
  }
});
</script>

<template>
  <div v-if="currentWord" class="card-content w-full max-w-lg mx-auto flex-grow flex flex-col justify-between">
    <div>
        <ProgressBar />
        <div class="flex justify-between items-center mb-1">
            <h3 class="text-xl font-semibold text-slate-700">Multiple Choice</h3>
            <div class="quiz-stats-text text-right text-xs"><p class="text-green-600 inline-block mr-2">Richtig: {{ store.roundCorrectCount }}</p><p class="text-red-500 inline-block">Falsch: {{ store.roundIncorrectCount }}</p></div>
        </div>
        <p class="text-gray-500 mb-4 text-sm">Wähle die richtige Übersetzung:</p>
        <div class="text-2xl font-bold text-center my-6 p-4 bg-sky-50 rounded-lg text-sky-700 min-h-[60px] flex items-center justify-center">
            {{ store.currentQuizDirection === 'frToDe' ? currentWord.french : currentWord.german }}
            <span v-if="store.currentQuizDirection === 'frToDe'" @click="speakFrench(currentWord.french, $event)" class="cursor-pointer ml-2">
              <i class="fa-solid fa-volume-high text-gray-500 hover:text-blue-600"></i>
            </span>
        </div>
        <div id="optionsContainer" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="option in options" :key="option" @click="checkAnswer(option)" :disabled="isAnswered" class="mc-option-button option-btn">
                {{ option }}
            </button>
        </div>
        <div id="feedbackArea" class="mt-4 text-center min-h-[40px]">
            <p id="feedbackMC" :class="['h-6', feedbackText.startsWith('Richtig') ? 'feedback-text-correct' : 'feedback-text-incorrect']">
                {{ feedbackText }}
            </p>
        </div>
    </div>
    <div class="mt-auto">
        <button v-if="isAnswered" @click="next" id="nextQuestionBtnMC" class="btn btn-primary mt-6 w-full">Nächste Frage</button>
        <button @click="quit" class="btn btn-neutral mt-2 w-full">Quiz abbrechen</button>
    </div>
  </div>
</template>
