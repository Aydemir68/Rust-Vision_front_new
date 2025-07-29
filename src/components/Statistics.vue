<template>
  <main class="flex-1 bg-gray-100 p-4">
    <!-- Заголовок -->
    <div class="flex align-items-center gap-3 mb-5" style="position: relative;">
      <button 
        @click="$emit('back')"
        class="p-2 border-none surface-0 text-gray-600 cursor-pointer border-round-xl hover:surface-100"
      >
        <i class="pi pi-arrow-left text-lg"></i>
      </button>
      <h2 class="text-xl font-bold text-gray-800 m-0">Статистика за {{ selectedDate }}</h2>
      <button 
        @click="showExportMenu = !showExportMenu"
        class="border-round-xl border-none bg-blue-200 p-2 px-4 text-blue-600 font-bold cursor-pointer hover:bg-blue-300 active:bg-blue-400 ml-2"
        ref="exportBtn"
      >Выгрузить отчет</button>
      <div v-if="showExportMenu" class="scroll-rounded export-menu surface-card shadow-2 border-round-xl p-2 overflow-y-scroll h-25rem" :style="exportMenuStyle">
        <div class="font-semibold text-gray-700 mb-2">Выберите запуск:</div>
        <div v-for="(launch, idx) in stats.launchTimes" :key="idx" class="export-menu-item hover:bg-blue-100 cursor-pointer p-2 border-round-lg flex align-items-center gap-2" @click="selectExport(launch, idx)">
          <span class="text-blue-500 font-bold">Запуск {{ idx + 1 }}</span>
          <span class="text-gray-500">({{ launch.time }})</span>
        </div>
      </div>
    </div>

    <!-- Контент -->
    <div class="flex flex-column lg:flex-row gap-4 w-full h-full">
      <!-- Левая колонка -->
      <div class="grid w-full lg:w-9 grid-nogutter">
        <div class="col-12 md:col-4 p-2" v-for="(item, i) in cards" :key="i">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">{{ item.label }}</span>
            <span :class="item.class + ' text-2xl font-bold pt-4'">{{ item.value }}</span>
          </div>
        </div>

        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 surface-card border-round-2xl p-4 flex flex-column gap-3">
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

        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 surface-card border-round-2xl p-4 flex flex-column gap-3" ref="bottomBlock">
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

      <!-- Правая колонка -->
      <div class="w-full lg:w-3 p-2 flex flex-column">
        <div class="custom-hover custom-container shadow-1 surface-card border-round-xl p-4 flex flex-column" :style="{ height: rightPanelHeight + 'px' }">
          <span class="text-sm text-gray-500 mb-3">Распознавания</span>
          <div class="flex-1 overflow-y-auto scroll-rounded">
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
import { computed, ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  selectedDate: String
})
defineEmits(['back'])

const showExportMenu = ref(false)
const exportBtn = ref(null)
const bottomBlock = ref(null)
const rightPanelHeight = ref(600)

const exportMenuStyle = computed(() => ({
  position: 'absolute',
  top: '48px',
  left: '0',
  zIndex: 10,
  minWidth: '220px',
}))

const selectExport = (launch, idx) => {
  showExportMenu.value = false
  alert(`Выбран запуск ${idx + 1} (${launch.time})`)
}

const handleClickOutside = event => {
  if (
    showExportMenu.value &&
    exportBtn.value &&
    !exportBtn.value.contains(event.target) &&
    !event.target.closest('.export-menu')
  ) {
    showExportMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => {
    if (bottomBlock.value) {
      rightPanelHeight.value = bottomBlock.value.offsetHeight
    }
  })
})

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

  const launchTimes = Array.from({ length: launches }, () => {
    const hour = Math.floor(Math.random() * 14) + 8
    const minute = Math.floor(Math.random() * 60)
    return { time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` }
  }).sort((a, b) => a.time.localeCompare(b.time))

  const recognitions = Array.from({ length: Math.min(20, peopleDetected) }, (_, i) => {
    const hour = Math.floor(Math.random() * 14) + 8
    const minute = Math.floor(Math.random() * 60)
    return {
      id: i + 1,
      time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }
  }).sort((a, b) => a.time.localeCompare(b.time))

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

const cards = computed(() => [
  { label: 'Запусков', value: stats.value.launches, class: 'text-gray-700' },
  { label: 'Успешных', value: stats.value.successful, class: 'text-green-600' },
  { label: 'Ошибок', value: stats.value.errors, class: 'text-red-600' },
  { label: 'Распознано людей', value: stats.value.peopleDetected, class: 'text-gray-700' },
  { label: 'Нарушений', value: stats.value.violations, class: 'text-orange-600' },
  { label: 'Время работы', value: stats.value.workTime, class: 'text-gray-700' },
])
</script>

<style scoped>
.custom-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-hover:hover {
  transform: translateY(-5px);
}
.scroll-rounded::-webkit-scrollbar {
  width: 8px;
}
.scroll-rounded::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
.scroll-rounded::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.scroll-rounded::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
.scroll-rounded {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.custom-container {
  min-height: 44.5rem;
}
</style>
