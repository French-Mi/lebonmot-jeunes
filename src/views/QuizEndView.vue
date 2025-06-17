<script setup>
import { computed, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()
const router = useRouter()

// Sicherstellen, dass die Seite nicht direkt aufgerufen wird
onBeforeMount(() => {
  if (store.initialQuizWordCount === 0) {
    router.push('/')
  }
})

// Speichert den Fortschritt, sobald der Ergebnisbildschirm angezeigt wird
onMounted(() => {
    store.completeLearningSession()
})

const isFlashcardQuiz = computed(() => store.currentQuizType === 'flashcards')

const scoreDisplay = computed(() => {
    return `${store.roundCorrectCount} / ${store.initialQuizWordCount}`
})

const hasIncorrectWords = computed(() => store.incorrectlyAnsweredWordsGlobal.length > 0)
const incorrectCount = computed(() => store.incorrectlyAnsweredWordsGlobal.length)

// Navigationsfunktionen
function restartQuiz() {
    // Hier könnte man eine Aktion im Store aufrufen, um das gleiche Quiz neu zu starten
    router.push('/learn-options');
}

function reviewErrors() {
    // Diese Funktion wird später implementiert
    console.log("Starte Wiederholungsrunde für Fehler...");
}

function goHome() {
    store.quitQuiz();
    router.push('/');
}

</script>

<template>
    <div class="card-content w-full max-w-md mx-auto text-center flex-grow flex flex-col justify-center items-center">
        <!-- Hier könnte eine Feier-Animation stehen, wenn alles richtig war -->
        <h2 class="text-2xl font-semibold mb-4 text-slate-700">Runde beendet!</h2>

        <!-- Ergebnis für Karteikarten -->
        <div v-if="isFlashcardQuiz" class="quiz-stats-text text-center mb-4 text-lg">
            <p class="text-green-600">Sicher: {{ store.sureCount }}</p>
            <p class="text-orange-500">Unsicher: {{ store.unsureCount }}</p>
            <p class="text-red-500">Ahnungslos: {{ store.noIdeaCount }}</p>
        </div>

        <!-- Ergebnis für Multiple Choice / Manuelle Eingabe -->
        <div v-else>
            <p class="text-lg text-gray-700 mb-2">Dein Ergebnis:</p>
            <p class="text-4xl font-bold my-4 text-blue-600">{{ scoreDisplay }}</p>
        </div>

        <!-- Fehler wiederholen Option -->
        <div v-if="hasIncorrectWords" class="w-full">
            <p class="text-md text-gray-600 my-4">Du hattest {{ incorrectCount }} Fehler. Möchtest du diese wiederholen?</p>
            <button @click="reviewErrors" class="btn btn-primary w-full">Die {{ incorrectCount }} Fehler nochmal üben</button>
        </div>

        <!-- Navigations-Buttons -->
        <div class="space-y-3 mt-6 w-full">
            <button @click="restartQuiz" class="btn btn-primary w-full">Neue Runde starten</button>
            <button @click="goHome" class="btn btn-neutral w-full">Zurück zur Startseite</button>
        </div>
    </div>
</template>
