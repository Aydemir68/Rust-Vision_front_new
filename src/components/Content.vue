<template>
  <main class="flex-1 bg-gray-100 p-4">
    <!-- Фильтры -->
    <div class="flex gap-3 mb-5">
      <div class="flex align-items-center border-1 border-300 border-round-2xl px-3 py-2">
        <label class="text-m text-gray-500 mr-2">Организация:</label>
        <select class="text-sm font-semibold border-none outline-none bg-gray-100 cursor-pointer">
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>
      <div class="flex align-items-center border-1 border-300 border-round-2xl px-3 py-2">
        <label class="text-m text-gray-500 mr-2">Камеры:</label>
        <select class="text-sm font-semibold border-none outline-none bg-gray-100 cursor-pointer">
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>
    </div>

    <div class="flex flex-column lg:flex-row gap-4 w-full">
      <!-- Карточки -->
      <div class="grid w-full lg:w-9 grid-nogutter">
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Всего запусков</span>
            <span class="text-2xl font-bold pt-4">10</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Успешных запусков</span>
            <span class="text-2xl font-bold pt-4">8</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Время работы</span>
            <span class="text-2xl font-bold pt-4">2ч 34м</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Распознано людей</span>
            <span class="text-2xl font-bold pt-4">20</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Нарушений</span>
            <span class="text-2xl font-bold pt-4">0</span>
          </div>
        </div>
        <div class="col-12 md:col-4 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-2">
            <span class="text-sm text-gray-500">Стат</span>
            <span class="text-2xl font-bold pt-4">+34%</span>
          </div>
        </div>
        <!-- Активные видео -->
        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-3">
            <span class="text-sm text-gray-500 mb-2">Активные видео</span>
            <div class="flex flex-column gap-2">
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">video20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-300 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:80%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">80%</span>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">office_entrance_20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-300 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:45%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">45%</span>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">parking_20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-300 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:100%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>

      <!-- Календарь -->
      <div class="w-full lg:w-3 p-2">
        <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-xl p-4 h-full flex flex-column">
          <span class="text-sm text-gray-500 mb-3">Календарь активности</span>
          <!-- Месяц и стрелки -->
          <div class="flex align-items-center justify-content-between mb-2">
            <button
              class="p-0 border-none surface-0 text-xl text-gray-400 cursor-pointer"
              :disabled="monthIndex === 0"
              @click="prevMonth"
            >
              <i class="pi pi-chevron-left"></i>
            </button>
            <span class="text-base font-bold text-gray-700">{{ monthNames[monthIndex] }} 2025</span>
            <button
              class="p-0 border-none surface-0 text-xl text-gray-400 cursor-pointer"
              :disabled="monthIndex === 11"
              @click="nextMonth"
            >
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
          <!-- Дни недели -->
          <div class="grid text-xs text-gray-400 mb-1">
            <div class="col text-center">Пн</div>
            <div class="col text-center">Вт</div>
            <div class="col text-center">Ср</div>
            <div class="col text-center">Чт</div>
            <div class="col text-center">Пт</div>
            <div class="col text-center">Сб</div>
            <div class="col text-center">Вс</div>
          </div>
          <!-- Дни месяца -->
          <div class="grid gap-2" style="min-height: 182px;">
            <!-- Пустые ячейки для смещения -->
            <template v-for="n in firstDayOffset" :key="'empty'+n">
              <div class="col text-center"></div>
            </template>
            <!-- Ячейки с днями -->
            <template v-for="d in daysInMonth" :key="d">
              <div
                class="col flex align-items-center justify-content-center border-round-xl w-2rem h-2rem"
                :class="isActive(d) ? 'bg-blue-100 text-blue-700 font-bold' : 'surface-100 text-gray-600'"
              >
                {{ d }}
              </div>
            </template>
          </div>
          <!-- Количество выделенных дат -->
          <div class="flex flex-column align-items-center mt-5">
            <div class="font-semibold text-xl text-gray-500 mb-2">Статистика за месяц:</div>
            <span class="text-2xl text-blue-600 font-semibold">
              {{ currentActiveCount }} отчетов
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

// Пример активных дат для каждого месяца (можно заменить на API)
const activeDates = ref({
  0: [3, 5, 12, 21], // Январь
  1: [2, 14, 15, 28], // Февраль
  2: [1, 2, 3, 4, 5], // Март
  3: [10, 20, 30],    // Апрель
  4: [8, 9, 10, 20],  // Май
  5: [7, 14, 21, 28], // Июнь
  6: [2, 4, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], // Июль
  7: [1, 11, 21, 31], // Август
  8: [5, 10, 15, 20, 25, 30], // Сентябрь
  9: [10, 15, 20],    // Октябрь
  10: [3, 13, 23],    // Ноябрь
  11: [7, 17, 27],    // Декабрь
})

const monthIndex = ref(new Date().getFullYear() === 2025 ? new Date().getMonth() : 0)

const daysInMonth = computed(() => {
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex.value]
})

const firstDayOffset = computed(() => {
  const d = new Date(2025, monthIndex.value, 1)
  let day = d.getDay()
  if (day === 0) day = 7
  return day - 1
})

// Проверка, выделен ли день
function isActive(day) {
  return activeDates.value[monthIndex.value]?.includes(day)
}

// Количество отчетов в месяце
const currentActiveCount = computed(() => {
  return activeDates.value[monthIndex.value]?.length || 0
})

function prevMonth() {
  if (monthIndex.value > 0) monthIndex.value--
}
function nextMonth() {
  if (monthIndex.value < 11) monthIndex.value++
}
</script>

<style scoped>
.custom-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.custom-hover:hover {
  transform: translateY(-5px);
}
</style>
