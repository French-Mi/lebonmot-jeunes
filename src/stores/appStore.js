import { defineStore } from 'pinia'
import { allVocabData } from '@/data/index.js'
import { achievements } from '@/data/achievements.js'
import { getWeekNumber } from '@/utils/helpers.js'

export const useAppStore = defineStore('app', {
  state: () => ({
    selectedLevel: null,
    selectedChapter: null,
    selectedMainChapter: null,
    vocabDataGlobal: allVocabData,
    quizWords: [],
    currentQuestionIndex: 0,
    roundCorrectCount: 0,
    roundIncorrectCount: 0,
    sureCount: 0,
    unsureCount: 0,
    noIdeaCount: 0,
    currentQuizType: '',
    currentQuizDirection: 'frToDe',
    isReviewRound: false,
    initialQuizWordCount: 0,
    incorrectlyAnsweredWordsGlobal: [],
    notification: { show: false, title: '', description: '', icon: '' },
    learningProgress: {
      completedChapters: {},
      startedChapters: {},
      streak: { current: 0, lastLearnedDate: null },
      weeklyStats: {},
      dailyVocabCount: {},
      totalXp: 0,
      achievements: [],
      consecutivePerfectChapters: 0,
      dailyStats: { date: null, modesUsed: [] },
      hasCompletedFirstLesson: false,
    },
    incorrectWordsHistory: [],
    searchQuery: '',
    searchResults: [],
    searchPerformed: false,
  }),

  getters: {
    levelNames: (state) => Object.keys(state.vocabDataGlobal),
    isChapterCompleted: (state) => (level, chapter, mainChapter = null) => { const chapterKey = mainChapter ? `${mainChapter} - ${chapter}` : chapter; return state.learningProgress.completedChapters[level]?.includes(chapterKey) || false; },
    isChapterStarted: (state) => (level, chapter, mainChapter = null) => { const chapterKey = mainChapter ? `${mainChapter} - ${chapter}` : chapter; if (state.learningProgress.completedChapters[level]?.includes(chapterKey)) { return false; } return state.learningProgress.startedChapters[level]?.includes(chapterKey) || false; },
    levelInfo(state) { if (!state.learningProgress || typeof state.learningProgress.totalXp !== 'number') { return { level: 1, currentLevelXp: 0, xpForNextLevel: 100, progressPercentage: 0 }; } const totalXp = state.learningProgress.totalXp; let level = 1; let xpForNext = 100; let xpForCurrentLevel = 0; while (totalXp >= xpForCurrentLevel + xpForNext) { xpForCurrentLevel += xpForNext; level++; } const currentLevelXp = totalXp - xpForCurrentLevel; const progressPercentage = Math.floor((currentLevelXp / xpForNext) * 100); return { level, currentLevelXp, xpForNextLevel: xpForNext, progressPercentage }; },
    currentWord: (state) => state.quizWords[state.currentQuestionIndex] || null,
    isQuizFinished: (state) => state.currentQuestionIndex >= state.initialQuizWordCount && state.initialQuizWordCount > 0,
  },

  actions: {
    selectLevel(level) { this.selectedLevel = level; },
    selectChapter(chapter) { this.selectedChapter = chapter; },
    selectMainChapter(mainChapter) { this.selectedMainChapter = mainChapter; },
    setQuizDirection(direction) { this.currentQuizDirection = direction; },
    saveProgress() { try { localStorage.setItem('leBonMotProgress', JSON.stringify(this.learningProgress)); localStorage.setItem('leBonMotIncorrectWords', JSON.stringify(this.incorrectWordsHistory)); } catch (e) { console.error('Fehler beim Speichern des Fortschritts:', e); } },
    loadProgress() { try { const p = JSON.parse(localStorage.getItem('leBonMotProgress') || '{}'); this.learningProgress = { ...this.learningProgress, ...p }; this.incorrectWordsHistory = JSON.parse(localStorage.getItem('leBonMotIncorrectWords') || '[]'); this.updateStreak(); } catch (e) { console.error('Fehler beim Laden des Fortschritts:', e); } },
    updateStreak() { const today = new Date().toDateString(); if (!this.learningProgress.streak || typeof this.learningProgress.streak !== 'object') { this.learningProgress.streak = { current: 0, lastLearnedDate: null }; } const lastLearned = this.learningProgress.streak.lastLearnedDate; if (lastLearned && (new Date(today) - new Date(lastLearned)) / (1000 * 60 * 60 * 24) > 1) { this.learningProgress.streak.current = 0; this.learningProgress.consecutivePerfectChapters = 0; } this.saveProgress(); },
    startQuiz(quizType, options = {}) {
        let wordsForQuiz = [];
        const isReview = Array.isArray(options.words);
        if (!isReview) { this.markChapterAsStarted(); }
        if (isReview) { wordsForQuiz = [...options.words].sort(() => 0.5 - Math.random()); } else { let chapterVocab = this.selectedMainChapter ? this.vocabDataGlobal[this.selectedLevel][this.selectedMainChapter][this.selectedChapter] : this.vocabDataGlobal[this.selectedLevel][this.selectedChapter]; if (!Array.isArray(chapterVocab) || chapterVocab.length === 0) return false; const vocabCount = options.vocabCount || 0; const numVocs = vocabCount > 0 ? Math.min(vocabCount, chapterVocab.length) : chapterVocab.length; wordsForQuiz = [...chapterVocab].sort(() => 0.5 - Math.random()).slice(0, numVocs); }
        if (wordsForQuiz.length === 0) return false;
        this.$patch({ quizWords: wordsForQuiz, currentQuizType: quizType, initialQuizWordCount: wordsForQuiz.length, isReviewRound: isReview, currentQuestionIndex: 0, roundCorrectCount: 0, roundIncorrectCount: 0, sureCount: 0, unsureCount: 0, noIdeaCount: 0, incorrectlyAnsweredWordsGlobal: [], });
        this.checkAndAwardAchievements('QUIZ_START');
        return true;
    },
    nextQuestion() { if (!this.isQuizFinished) { this.currentQuestionIndex++; } },
    handleFlashcardFeedback(feedback) { if (feedback === 'sure') { this.sureCount++; } else { if (feedback === 'unsure') this.unsureCount++; if (feedback === 'noIdea') this.noIdeaCount++; if (!this.incorrectlyAnsweredWordsGlobal.some((v) => v.french === this.currentWord.french)) { this.incorrectlyAnsweredWordsGlobal.push(this.currentWord); this.logIncorrectWord(this.currentWord); } } this.nextQuestion(); },

    submitAnswer(userAnswer) {
      // KORRIGIERT: Robustere Normalisierungsfunktion
      const normalizeFunc = (answer) =>
        String(answer)
          .toLowerCase()
          .trim()
          .replace(/[`´’']/g, "'") // 1. Alle Apostroph-Arten vereinheitlichen
          .replace(/[.,/#!$%^&*;:{}=\-_`~()"?¡¿!]/g, '') // 2. Alle Satzzeichen entfernen
          .replace(/\s+/g, ' ') // 3. Mehrfache Leerzeichen reduzieren
          .trim();

      const correctOptions = (
        this.currentQuizDirection === 'frToDe' ? this.currentWord.german : this.currentWord.french
      ).split(/[;/]\s*/);

      const isCorrect = correctOptions.some(
        (opt) => normalizeFunc(opt) === normalizeFunc(userAnswer)
      );

      if (isCorrect) {
        this.roundCorrectCount++;
      } else {
        this.roundIncorrectCount++;
        if (!this.incorrectlyAnsweredWordsGlobal.some((v) => v.french === this.currentWord.french)) {
          this.incorrectlyAnsweredWordsGlobal.push(this.currentWord);
          this.logIncorrectWord(this.currentWord);
        }
      }
      return isCorrect;
    },
    overrideAsCorrect() { this.roundCorrectCount++; this.roundIncorrectCount--; this.incorrectlyAnsweredWordsGlobal.pop(); },
    completeLearningSession() {
      const correctlyLearnedCount = this.currentQuizType === 'flashcards' ? this.sureCount : this.roundCorrectCount;
      if (correctlyLearnedCount === 0 && !this.isReviewRound) return;
      const today = new Date();
      const todayString = today.toDateString();
      if (this.learningProgress.streak.lastLearnedDate !== todayString) { this.learningProgress.streak.current = this.learningProgress.streak.lastLearnedDate && (new Date(todayString) - new Date(this.learningProgress.streak.lastLearnedDate)) / (1000 * 60 * 60 * 24) === 1 ? this.learningProgress.streak.current + 1 : 1; this.learningProgress.streak.lastLearnedDate = todayString; }
      const weekKey = getWeekNumber(today);
      if (!this.learningProgress.weeklyStats[weekKey]) this.learningProgress.weeklyStats[weekKey] = 0;
      this.learningProgress.weeklyStats[weekKey] += correctlyLearnedCount;
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayKey = `${year}-${month}-${day}`;
      if (!this.learningProgress.dailyVocabCount) this.learningProgress.dailyVocabCount = {};
      if (!this.learningProgress.dailyVocabCount[todayKey]) { this.learningProgress.dailyVocabCount[todayKey] = 0; }
      this.learningProgress.dailyVocabCount[todayKey] += correctlyLearnedCount;
      this.learningProgress.totalXp += correctlyLearnedCount;
      this.saveProgress();
      this.checkAndAwardAchievements('SESSION_END');
    },
    quitQuiz() { this.selectedLevel = null; this.selectedChapter = null; this.selectedMainChapter = null; },
    markChapterAsStarted() { const chapterKey = this.selectedMainChapter ? `${this.selectedMainChapter} - ${this.selectedChapter}` : this.selectedChapter; if (!this.selectedLevel || !chapterKey) return; if (!this.learningProgress.startedChapters[this.selectedLevel]) { this.learningProgress.startedChapters[this.selectedLevel] = []; } const isAlreadyCompleted = this.learningProgress.completedChapters[this.selectedLevel]?.includes(chapterKey); const isAlreadyStarted = this.learningProgress.startedChapters[this.selectedLevel].includes(chapterKey); if (!isAlreadyCompleted && !isAlreadyStarted) { this.learningProgress.startedChapters[this.selectedLevel].push(chapterKey); this.saveProgress(); } },
    markChapterAsCompleted() { const chapterKey = this.selectedMainChapter ? `${this.selectedMainChapter} - ${this.selectedChapter}` : this.selectedChapter; if (!this.selectedLevel || !chapterKey) return; if (!this.learningProgress.completedChapters[this.selectedLevel]) { this.learningProgress.completedChapters[this.selectedLevel] = []; } if (!this.learningProgress.completedChapters[this.selectedLevel].includes(chapterKey)) { this.learningProgress.completedChapters[this.selectedLevel].push(chapterKey); } if (this.learningProgress.startedChapters[this.selectedLevel]) { const index = this.learningProgress.startedChapters[this.selectedLevel].indexOf(chapterKey); if (index > -1) { this.learningProgress.startedChapters[this.selectedLevel].splice(index, 1); } } this.saveProgress(); this.checkAndAwardAchievements('CHAPTER_COMPLETE'); },
    logIncorrectWord(wordObject) { if (!wordObject || !wordObject.french) return; const newErrorEntry = { ...wordObject, timestamp: new Date().toISOString() }; this.incorrectWordsHistory.push(newErrorEntry); this.saveProgress(); },
    showNotification(achievement) { this.notification = { show: true, title: achievement.title, description: achievement.description, icon: achievement.icon }; setTimeout(() => { this.notification.show = false; }, 5000); },
    startGlobalReview(days) {
      const now = new Date();
      const cutoffDate = new Date(now.setDate(now.getDate() - days));
      const recentErrors = this.incorrectWordsHistory.filter(entry => new Date(entry.timestamp) >= cutoffDate);
      if (recentErrors.length === 0) {
        alert(`Keine Fehler in den letzten ${days} ${days > 1 ? 'Tagen' : 'Tag'} gefunden. Super!`);
        return false;
      }
      const uniqueWordsMap = new Map();
      recentErrors.forEach(entry => { uniqueWordsMap.set(entry.french, entry); });
      const wordsToReview = Array.from(uniqueWordsMap.values());
      return this.startQuiz('manualInput', { words: wordsToReview });
    },
    checkAndAwardAchievements(eventType) {
      const newAchievements = [];
      for (const achievement of Object.values(achievements)) {
        if (this.learningProgress.achievements.includes(achievement.id)) { continue; }
        let unlocked = false;
        switch (achievement.id) {
          case 'DAILY_ROUTINE':   if (eventType === 'SESSION_END' && this.learningProgress.streak.current >= 3) unlocked = true; break;
          case 'WEEKLY_CHAMPION': if (eventType === 'SESSION_END' && this.learningProgress.streak.current >= 7) unlocked = true; break;
          case 'PERSEVERANCE':    if (eventType === 'SESSION_END' && this.learningProgress.streak.current >= 14) unlocked = true; break;
          case 'MONTHLY_MASTER':  if (eventType === 'SESSION_END' && this.learningProgress.streak.current >= 30) unlocked = true; break;
          case 'VOCAB_COLLECTOR': if (eventType === 'SESSION_END' && this.learningProgress.totalXp >= 100) unlocked = true; break;
          case 'VOCAB_VIRTUOSO':  if (eventType === 'SESSION_END' && this.learningProgress.totalXp >= 500) unlocked = true; break;
          case 'LEXICON_LEGEND':  if (eventType === 'SESSION_END' && this.learningProgress.totalXp >= 1000) unlocked = true; break;
          case 'ERROR_CONQUEROR': if (eventType === 'SESSION_END' && this.isReviewRound && this.incorrectlyAnsweredWordsGlobal.length === 0) unlocked = true; break;
          case 'LEARNING_MARATHON': if (eventType === 'QUIZ_START' && !this.isReviewRound && this.initialQuizWordCount > 50) unlocked = true; break;
          case 'METHOD_MIXER':
            if (eventType === 'QUIZ_START') {
              const today = new Date().toDateString();
              if (this.learningProgress.dailyStats.date !== today) { this.learningProgress.dailyStats = { date: today, modesUsed: [] }; }
              if (!this.learningProgress.dailyStats.modesUsed.includes(this.currentQuizType)) { this.learningProgress.dailyStats.modesUsed.push(this.currentQuizType); }
              const allModesUsed = ['flashcards', 'multipleChoice', 'manualInput'].every(mode => this.learningProgress.dailyStats.modesUsed.includes(mode));
              if (allModesUsed) unlocked = true;
            }
            break;
          case 'CHAPTER_GURU':
            if (eventType === 'CHAPTER_COMPLETE') {
              const totalCompleted = Object.values(this.learningProgress.completedChapters).flat().length;
              if (totalCompleted >= 5) unlocked = true;
            }
            break;
          case 'LEVEL_MASTER':
             if (eventType === 'CHAPTER_COMPLETE') {
                const levelVocab = this.vocabDataGlobal[this.selectedLevel];
                const totalChaptersInLevel = Object.keys(levelVocab).filter(key => Array.isArray(levelVocab[key])).length + Object.values(levelVocab).filter(val => typeof val === 'object' && !Array.isArray(val)).reduce((acc, mainChapter) => acc + Object.keys(mainChapter).length, 0);
                const completedInLevel = this.learningProgress.completedChapters[this.selectedLevel]?.length || 0;
                if (completedInLevel === totalChaptersInLevel) unlocked = true;
             }
             break;
        }
        if (unlocked) { this.learningProgress.achievements.push(achievement.id); newAchievements.push(achievement); }
      }
      newAchievements.forEach(ach => this.showNotification(ach));
      if (newAchievements.length > 0) this.saveProgress();
    },
    performSearch(query) {
      this.searchQuery = query;
      this.searchPerformed = true;
      this.searchResults = [];
      if (!query || query.trim().length < 2) { return; }
      const lowerCaseQuery = query.toLowerCase();
      const results = [];
      for (const levelName in this.vocabDataGlobal) {
        for (const chapterName in this.vocabDataGlobal[levelName]) {
          const chapterData = this.vocabDataGlobal[levelName][chapterName];
          if (typeof chapterData === 'object' && !Array.isArray(chapterData)) {
            for (const subChapterName in chapterData) {
              const subChapterVocab = chapterData[subChapterName];
              if (Array.isArray(subChapterVocab)) {
                subChapterVocab.forEach(vocab => {
                  if (vocab && typeof vocab.french === 'string' && typeof vocab.german === 'string') {
                    if (vocab.french.toLowerCase().includes(lowerCaseQuery) || vocab.german.toLowerCase().includes(lowerCaseQuery)) {
                      results.push({ ...vocab, context: `${levelName} > ${chapterName} > ${subChapterName}` });
                    }
                  }
                });
              }
            }
          } else if (Array.isArray(chapterData)) {
            chapterData.forEach(vocab => {
              if (vocab && typeof vocab.french === 'string' && typeof vocab.german === 'string') {
                if (vocab.french.toLowerCase().includes(lowerCaseQuery) || vocab.german.toLowerCase().includes(lowerCaseQuery)) {
                  results.push({ ...vocab, context: `${levelName} > ${chapterName}` });
                }
              }
            });
          }
        }
      }
      this.searchResults = results;
    },
    clearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
      this.searchPerformed = false;
    }
  },
})
