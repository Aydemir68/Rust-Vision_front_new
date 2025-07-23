<template>
  <main class="flex-1 p-6 bg-surface-50">
    <div class="flex flex-wrap gap-4 mb-5">
      <div class="flex align-items-center gap-2">
        <span class="font-bold text-gray-700">Организация:</span>
        <select id="org-filter" class="p-2 border-round-md border-1 border-gray-300 outline-none focus:border-gray-400 focus:border-round-xl">
          <option>Все</option>
          <option>Организация 1</option>
          <option>Организация 2</option>
        </select>
      </div>
      <div class="flex align-items-center gap-2">
        <span class="font-bold text-gray-700">Камера:</span>
        <select id="cam-filter" class="p-2 border-round-md border-1 border-gray-300 outline-none focus:border-blue-400">
          <option>Все</option>
          <option>Камера 1</option>
          <option>Камера 2</option>
        </select>
      </div>
    </div>
    <div class="grid grid-nogutter gap-5">
      <div class="custom-hover cursor-pointer col-12 md:col-6 lg:col-3">
        <div class="flex surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center bg-blue-50">
          <span class="pi pi-refresh text-3xl text-blue-500 mb-2"></span>
          <span class="text-2xl text-gray-600 font-bold mb-2">Запуски</span>
          <div class="flex align-items-end gap-2">
            <span class="text-gray-600 text-xl">4</span>
          </div>
        </div>
      </div>
      <div class="custom-hover cursor-pointer col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center bg-green-50">
          <span class="pi pi-check-circle text-3xl text-green-500 mb-2"></span>
          <span class="text-2xl text-gray-600 font-bold mb-2">Успешно запущено</span>
          <span class="text-gray-600 text-xl font-semibold">2</span>
        </div>
      </div>
      <div class="custom-hover cursor-pointer col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center bg-yellow-50">
          <span class="pi pi-chart-bar text-3xl text-yellow-500 mb-2"></span>
          <span class="text-2xl font-bold mb-2 text-gray-600">Статистика 3</span>
          <span class="text-gray-600">Описание или значение</span>
        </div>
      </div>
      <div class="custom-hover cursor-pointer col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 hover:shadow-3 border-round-xl p-4 flex flex-column align-items-center bg-purple-50">
          <span class="pi pi-database text-3xl text-purple-500 mb-2"></span>
          <span class="text-2xl font-bold mb-2 text-gray-600">Статистика 4</span>
          <span class="text-gray-600">Описание или значение</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.custom-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-hover:hover {
  /*opacity: 0.65;*/
  transform: translateY(-5px);
}
</style> 