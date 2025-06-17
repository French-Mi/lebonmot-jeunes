<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import ProgressBar from './ProgressBar.vue'
import { speakFrench } from '@/services/speechService.js'

const store = useAppStore()
const router = useRouter()

// Lokaler Zustand für diese Komponente
const userAnswer = ref('')
const feedbackText = ref('')
const isAnswered = ref(false)
const showMarkCorrect = ref(false)
const answerInput = ref(null) // Referenz für das Input-Feld, um es zu fokussieren

const currentWord = computed(() => store.currentWord)
const isQuestionFrench = computed(() => store.currentQuizDirection === 'frToDe')
const specialChars = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ô', 'û', 'ç', 'î', 'ï', 'œ', 'ù']

// Funktion zum Überprüfen der Antwort
function submit() {
  if (!userAnswer.value.trim() || isAnswered.value) return

  isAnswered.value = true
  const isCorrect = store.submitAnswer(userAnswer.value)

  if (isCorrect) {
    feedbackText.value = "Richtig!"
  } else {
    const correctAnswer = store.currentQuizDirection === 'frToDe' ? currentWord.value.german : currentWord.value.french
    feedbackText.value = `Falsch. Richtig: ${correctAnswer}`
    showMarkCorrect.value = true
  }
}

// Funktion für die "Als richtig markieren"-Schaltfläche
function override() {
    store.overrideAsCorrect()
    feedbackText.value = 'Als richtig markiert!'
    showMarkCorrect.value = false
}

// Funktion zum Anzeigen der nächsten Frage
function next() {
  store.nextQuestion()
}

// Funktion zum Abbrechen des Quiz
function quit() {
  store.quitQuiz()
  router.push('/')
}

// Funktion zum Hinzufügen von Sonderzeichen
function addSpecialChar(char) {
    userAnswer.value += char
    answerInput.value?.focus()
}

// Beobachtet, ob das Quiz beendet ist, und navigiert dann zum Ergebnisbildschirm
watch(() => store.isQuizFinished, (isFinished) => {
  if (isFinished) {
    router.push('/quiz-end')
  }
})

// Setzt den Zustand zurück, wenn sich die Frage ändert
watch(currentWord, () => {
  userAnswer.value = ''
  feedbackText.value = ''
  isAnswered.value = false
  showMarkCorrect.value = false
  // Fokussiert das Input-Feld, wenn die Komponente neu gerendert wird
  nextTick(() => {
    answerInput.value?.focus()
  })
}, { immediate: true })
</script>

<template>
  <div v-if="currentWord" class="card-content w-full max-w-lg mx-auto flex-grow flex flex-col justify-between">
    <div>
      <ProgressBar />
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-xl font-semibold text-slate-700">Manuelle Eingabe</h3>
        <div class="quiz-stats-text text-right text-xs">
          <p class="text-green-600 inline-block mr-2">Richtig: {{ store.roundCorrectCount }}</p>
          <p class="text-red-500 inline-block">Falsch: {{ store.roundIncorrectCount }}</p>
        </div>
      </div>
      <p class="text-gray-500 mb-4 text-sm">
        {{ store.currentQuizDirection === 'frToDe' ? 'Gib das deutsche Wort ein für:' : 'Gib das französische Wort ein für:' }}
      </p>
      <div class="text-2xl font-bold text-center my-6 p-4 bg-sky-50 rounded-lg text-sky-700 min-h-[60px] flex items-center justify-center">
        {{ store.currentQuizDirection === 'frToDe' ? currentWord.french : currentWord.german }}
        <span v-if="isQuestionFrench" @click="speakFrench(currentWord.french, $event)" class="cursor-pointer ml-2">
          <i class="fa-solid fa-volume-high text-gray-500 hover:text-blue-600"></i>
        </span>
      </div>

      <input
        ref="answerInput"
        v-model="userAnswer"
        @keyup.enter="isAnswered ? next() : submit()"
        :disabled="isAnswered"
        type="text"
        :lang="store.currentQuizDirection === 'deToFr' ? 'fr' : 'de'"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        :placeholder="store.currentQuizDirection === 'frToDe' ? 'Deutsches Wort...' : 'Französisches Wort...'">

      <div v-if="store.currentQuizDirection === 'deToFr'" id="specialCharsContainer" class="mt-3 flex flex-wrap justify-center gap-2">
        <button v-for="char in specialChars" :key="char" @click="addSpecialChar(char)" class="special-char-btn">
          {{ char }}
        </button>
      </div>

      <div id="feedbackAreaManual" class="mt-4 text-center min-h-[40px]">
        <p id="feedbackFill" :class="['h-6', feedbackText.startsWith('Richtig') || feedbackText.startsWith('Als') ? 'feedback-text-correct' : 'feedback-text-incorrect']">
          {{ feedbackText }}
        </p>
        <button v-if="showMarkCorrect" @click="override" id="markCorrectBtnManual" class="mark-correct-override-btn">
          Als richtig markieren
        </button>
      </div>
    </div>
    <div class="mt-auto">
      <button v-if="isAnswered" @click="next()" class="btn btn-primary mt-6 w-full">Nächste Frage</button>
      <button v-else @click="submit()" class="btn btn-primary mt-6 w-full">Antwort prüfen</button>
      <button @click="quit" class="btn btn-neutral mt-2 w-full">Quiz abbrechen</button>
    </div>
  </div>
</template>
