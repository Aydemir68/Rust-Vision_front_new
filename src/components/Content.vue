<template>
  <main class="flex-1 p-6 bg-surface-50">
    <div class="flex flex-wrap gap-3 mb-5">
      <div class="flex align-items-center border-1 border-500 border-round-2xl px-3 py-2 cursor-pointer">
        <label class="text-m text-gray-500 mr-1">Организация:</label>
        <select class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer">
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>

      <div class="flex align-items-center border-1 border-500 border-round-2xl px-3 py-2 cursor-pointer">
        <label class="text-m text-gray-500 mr-1">Камеры:</label>
        <select class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer">
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>
    </div>

    <div class="flex flex-column lg:flex-row gap-5">
      <!-- Сетка -->
      <div class="grid col-12 lg:col-9 grid-nogutter">
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Всего запусков</span>
            <span class="text-gray-900 text-xl font-bold">10</span>
          </div>
        </div>
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Успешных запусков</span>
            <span class="text-gray-900 text-xl font-bold">8</span>
          </div>
        </div>
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Ошибок</span>
            <span class="text-gray-900 text-xl font-bold">2</span>
          </div>
        </div>
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Длительность</span>
            <span class="text-gray-900 text-xl font-bold">2ч 34м</span>
          </div>
        </div>
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Распознано лиц</span>
            <span class="text-gray-900 text-xl font-bold">4</span>
          </div>
        </div>
        <div class="custom-hover cursor-pointer col-12 md:col-4 p-2">
          <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center text-center h-full">
            <span class="text-lg text-gray-600 font-bold mb-3">Нарушения</span>
            <span class="text-gray-900 text-xl font-bold">0</span>
          </div>
        </div>
      </div>

      <!--Правый блок-->
      <div class="col-12 lg:col-3">
        <div class="custom-hover cursor-pointer surface-card shadow-2 border-round-xl p-4 h-full flex flex-column justify-content-between">
          <span class="text-lg text-gray-600 font-bold mb-3">Активность</span>
          <div class="flex justify-content-center align-items-center h-full">
            <span class="text-400">[Диаграмма]</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.custom-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-hover:hover {
  transform: translateY(-5px);
}
</style>
