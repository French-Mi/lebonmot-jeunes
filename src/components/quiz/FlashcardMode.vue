<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import ProgressBar from './ProgressBar.vue'
import { speakFrench } from '@/services/speechService.js'

const store = useAppStore()
const router = useRouter()

const isFlipped = ref(false)
const currentWord = computed(() => store.currentWord)

watch(() => store.isQuizFinished, (isFinished) => {
  if (isFinished) {
    router.push('/quiz-end')
  }
}, { immediate: true })

const questionText = computed(() => {
  if (!currentWord.value) return ''
  return store.currentQuizDirection === 'frToDe' ? currentWord.value.french : currentWord.value.german
})

const answerText = computed(() => {
  if (!currentWord.value) return ''
  return store.currentQuizDirection === 'frToDe' ? currentWord.value.german : currentWord.value.french
})

const isQuestionFrench = computed(() => store.currentQuizDirection === 'frToDe')
const isAnswerFrench = computed(() => store.currentQuizDirection === 'deToFr')

function flipCard() {
  if (!isFlipped.value) {
    isFlipped.value = true
  }
}

function handleFeedback(feedback) {
  store.handleFlashcardFeedback(feedback)
  isFlipped.value = false
}

function quit() {
  store.quitQuiz()
  router.push('/')
}
</script>

<template>
  <div v-if="currentWord" class="card-content w-full max-w-lg mx-auto flex-grow flex flex-col">
    <div>
      <ProgressBar />
      <div class="flex justify-between items-center mb-1">
        <h3 class="text-xl font-semibold text-slate-700">Karteikarten</h3>
        <div class="quiz-stats-text text-right mb-2 text-xs">
          <p class="text-green-600 inline-block mr-2">Sicher: {{ store.sureCount }}</p>
          <p class="text-orange-500 inline-block mr-2">Unsicher: {{ store.unsureCount }}</p>
          <p class="text-red-500 inline-block">Ahnungslos: {{ store.noIdeaCount }}</p>
        </div>
      </div>
    </div>

    <div
      id="flashcard"
      @click="flipCard"
      class="bg-sky-50 rounded-lg p-6 flex-grow flex flex-col justify-center items-center text-center cursor-pointer min-h-[200px] my-3">

      <div class="text-2xl md:text-3xl font-bold text-sky-800">
        {{ questionText }}
        <span v-if="isQuestionFrench" @click="speakFrench(questionText, $event)" class="cursor-pointer ml-2">
          <i class="fa-solid fa-volume-high text-gray-500 hover:text-blue-600"></i>
        </span>
      </div>

      <template v-if="isFlipped">
        <hr class="w-1/2 my-4 border-sky-200">
        <p class="text-xl md:text-2xl text-gray-700">
          {{ answerText }}
          <span v-if="isAnswerFrench" @click="speakFrench(answerText, $event)" class="cursor-pointer ml-2">
            <i class="fa-solid fa-volume-high text-gray-500 hover:text-blue-600"></i>
          </span>
        </p>
      </template>
      <p v-else class="text-gray-500 mt-4 text-sm">(Klicken zum Umdrehen)</p>
    </div>

    <div v-if="isFlipped" id="feedbackButtons" class="mt-auto space-y-2">
      <div class="grid grid-cols-3 gap-2">
        <button @click="handleFeedback('noIdea')" class="btn bg-red-500 hover:bg-red-600 w-full">Ahnungslos</button>
        <button @click="handleFeedback('unsure')" class="btn bg-orange-500 hover:bg-orange-600 w-full">Unsicher</button>
        <button @click="handleFeedback('sure')" class="btn bg-green-500 hover:bg-green-600 w-full">Sicher</button>
      </div>
    </div>

    <button @click="quit" class="btn btn-neutral mt-4 w-full">Quiz abbrechen</button>
  </div>
</template>
