<template>
  <main class="flex-1 bg-gray-100 p-4">
    <!-- Заголовок с кнопкой возврата -->
    <div class="flex align-items-center gap-3 mb-5">
      <button 
        @click="$emit('back')"
        class="p-2 border-none surface-0 text-gray-600 cursor-pointer border-round-xl hover:surface-100"
      >
        <i class="pi pi-arrow-left text-lg"></i>
      </button>
      <h2 class="text-xl font-bold text-gray-800 m-0">Статистика за {{ selectedDate }}</h2>
    </div>

    <div class="flex flex-column lg:flex-row gap-4 w-full">
      <!-- Карточки -->
      <div class="grid w-full lg:w-9 grid-nogutter">
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Запусков</span>
            <span class="text-2xl font-bold pt-4">{{ stats.launches }}</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Успешных</span>
            <span class="text-2xl font-bold pt-4 text-green-600">{{ stats.successful }}</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Ошибок</span>
            <span class="text-2xl font-bold pt-4 text-red-600">{{ stats.errors }}</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Распознано людей</span>
            <span class="text-2xl font-bold pt-4">{{ stats.peopleDetected }}</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Нарушений</span>
            <span class="text-2xl font-bold pt-4 text-orange-600">{{ stats.violations }}</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Время работы</span>
            <span class="text-2xl font-bold pt-4">{{ stats.workTime }}</span>
          </div>
        </div>

        <!-- Детальная информация -->
        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-3">
            <span class="text-sm text-gray-500 mb-2">Детальная информация</span>
            <div class="flex flex-column gap-2">
              <div class="flex justify-content-between align-items-center p-2 border-round-xl bg-surface-50">
                <span class="text-sm text-gray-500">Начало работы:</span>
                <span class="font-semibold text-gray-800">{{ stats.startTime }}</span>
              </div>
              <div class="flex justify-content-between align-items-center p-2 border-round-xl bg-surface-50">
                <span class="text-sm text-gray-500">Конец работы:</span>
                <span class="font-semibold text-gray-800">{{ stats.endTime }}</span>
              </div>
              <div class="flex justify-content-between align-items-center p-2 border-round-xl bg-surface-50">
                <span class="text-sm text-gray-500">Обработано кадров:</span>
                <span class="font-semibold text-gray-800">{{ stats.framesProcessed.toLocaleString() }}</span>
              </div>
              <div class="flex justify-content-between align-items-center p-2 border-round-xl bg-surface-50">
                <span class="text-sm text-gray-500">Средняя точность:</span>
                <span class="font-semibold text-gray-800">{{ stats.accuracy }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Время запусков -->
        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-3">
            <span class="text-sm text-gray-500 mb-2">Время запусков</span>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(launch, index) in stats.launchTimes" 
                :key="index"
                class="text-sm font-semibold text-gray-700 p-2 border-round-xl bg-surface-100"
              >
                {{ launch.time }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Распознавания -->
      <div class="w-full lg:w-3 p-2">
        <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-xl p-4 h-full flex flex-column">
          <span class="text-sm text-gray-500 mb-3">Распознавания</span>
          <div class="flex flex-column gap-2">
            <div 
              v-for="(recognition, index) in stats.recognitions" 
              :key="index"
              class="flex justify-content-between align-items-center p-2 border-round-xl bg-surface-50"
            >
              <span class="text-sm text-gray-500">ID {{ recognition.id }},</span>
              <span class="text-sm font-semibold text-gray-800">время {{ recognition.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

defineEmits(['back'])

// Случайные данные для статистики
const stats = computed(() => {
  const launches = Math.floor(Math.random() * 20) + 5
  const successful = Math.floor(launches * 0.8)
  const errors = launches - successful
  const peopleDetected = Math.floor(Math.random() * 50) + 10
  const violations = Math.floor(Math.random() * 5)
  const workTime = `${Math.floor(Math.random() * 4) + 1}ч ${Math.floor(Math.random() * 60)}м`
  
  const startTime = `${Math.floor(Math.random() * 12) + 8}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
  const endTime = `${Math.floor(Math.random() * 8) + 16}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
  
  const framesProcessed = Math.floor(Math.random() * 10000) + 5000
  const accuracy = Math.floor(Math.random() * 20) + 80
  
  // Генерируем время запусков
  const launchTimes = []
  for (let i = 0; i < launches; i++) {
    const hour = Math.floor(Math.random() * 14) + 8 // с 8:00 до 22:00
    const minute = Math.floor(Math.random() * 60)
    const status = i < successful ? 'success' : 'error'
    launchTimes.push({
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      status
    })
  }
  // Сортируем по времени
  launchTimes.sort((a, b) => a.time.localeCompare(b.time))
  
  // Генерируем данные распознаваний (только 5 записей)
  const recognitions = []
  const numRecognitions = Math.min(5, peopleDetected) // максимум 5 записей
  for (let i = 1; i <= numRecognitions; i++) {
    const hour = Math.floor(Math.random() * 14) + 8 // с 8:00 до 22:00
    const minute = Math.floor(Math.random() * 60)
    recognitions.push({
      id: i,
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    })
  }
  // Сортируем по времени
  recognitions.sort((a, b) => a.time.localeCompare(b.time))

  return {
    launches,
    successful,
    errors,
    peopleDetected,
    violations,
    workTime,
    startTime,
    endTime,
    framesProcessed,
    accuracy,
    launchTimes,
    recognitions
  }
})
</script>

<style scoped>
.custom-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-hover:hover {
  transform: translateY(-5px);
}
</style> 