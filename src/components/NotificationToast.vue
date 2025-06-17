<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/appStore';

const appStore = useAppStore();
const notification = computed(() => appStore.notification);
</script>

<template>
  <transition name="toast-fade">
    <div v-if="notification.show" class="notification-toast">
      <i :class="[notification.icon, 'notification-icon']"></i>
      <div class="notification-content">
        <p class="font-bold">{{ notification.title }}</p>
        <p class="text-sm">{{ notification.description }}</p>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
  border-left: 5px solid #4ade80; /* Green accent */
  width: 320px;
}
.notification-icon {
  font-size: 2rem;
  color: #fbbf24; /* Amber color */
  margin-right: 1rem;
}
.notification-content {
  color: #374151;
}

/* Vue Transition Styles */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.5s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
