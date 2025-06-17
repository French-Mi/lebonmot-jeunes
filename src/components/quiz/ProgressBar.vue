<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()

const progress = computed(() => {
  if (store.initialQuizWordCount > 0) {
    return ((store.currentQuestionIndex) / store.initialQuizWordCount) * 100
  }
  return 0
})
</script>

<template>
  <div class="mb-3">
    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-blue-700">Fortschritt</span>
      <span class="text-sm font-medium text-blue-700">{{ store.currentQuestionIndex }} / {{ store.initialQuizWordCount }}</span>
    </div>
    <div class="progress-bar-bg w-full bg-gray-200 rounded-full h-2.5">
      <div class="progress-fill bg-blue-600 h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>
