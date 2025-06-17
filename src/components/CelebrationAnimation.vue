<template>
  <div class="vocab-celebration-container">
    <div class="celebrating-logo-vocab">
      <div class="speech-bubble-body-vocab">
        <div class="flag-icon-vocab">
          <div class="flag-blue-vocab"></div>
          <div class="flag-white-vocab"></div>
          <div class="flag-red-vocab"></div>
        </div>
      </div>
      <div class="speech-bubble-tail-vocab"></div>
    </div>
    <div v-for="i in 50" :key="i" class="confetti-vocab" :style="getConfettiStyle()"></div>
  </div>
</template>

<script setup>
const getConfettiStyle = () => {
  const colors = ['#ffc107', '#4A90E2', '#EF4135', '#FFFFFF', '#a855f7', '#22c55e'];
  const style = {
    left: `${Math.random() * 100}%`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDuration: `${1.0 + Math.random() * 0.8}s`,
    animationDelay: `${Math.random() * 0.6}s`,
    transform: `rotateZ(${Math.random() * 360}deg)`
  };
  return style;
};
</script>

<style scoped>
.vocab-celebration-container {
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
}

.celebrating-logo-vocab {
    position: relative;
    width: 70px;
    height: 70px;
    animation: celebrate-jump-vocab 1.2s ease-in-out infinite;
    z-index: 10;
}

@keyframes celebrate-jump-vocab {
    0%, 100% { transform: translateY(0) rotate(0); }
    25% { transform: translateY(-15px) rotate(-8deg); }
    50% { transform: translateY(0) rotate(0); }
    75% { transform: translateY(-10px) rotate(8deg); }
}

.celebrating-logo-vocab .speech-bubble-body-vocab {
    width: 100%;
    height: 52px;
    background-color: white;
    border-radius: 18px;
    border: 3px solid #4A90E2;
    position: relative;
    z-index: 2;
}

.celebrating-logo-vocab .speech-bubble-tail-vocab {
    position: absolute;
    bottom: -9px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid #4A90E2;
    z-index: 1;
}

.celebrating-logo-vocab .flag-icon-vocab {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 46px;
    height: 28px;
    display: flex;
    border: 1px solid #cccccc;
    border-radius: 2px;
    overflow: hidden;
    z-index: 4;
}

.flag-blue-vocab { background-color: #0055A4; flex: 1; }
.flag-white-vocab { background-color: #FFFFFF; flex: 1; }
.flag-red-vocab { background-color: #EF4135; flex: 1; }

.confetti-vocab {
    position: absolute;
    top: 0;
    width: 6px;
    height: 10px;
    opacity: 0;
    animation: confetti-fall-vocab ease-out forwards;
}

@keyframes confetti-fall-vocab {
    0% {
        transform: translateY(-20px) rotateZ(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(140px) rotateZ(720deg);
        opacity: 0;
    }
}
</style>
