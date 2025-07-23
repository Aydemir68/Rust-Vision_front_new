<template>
  <main class="flex-1 p-6 bg-surface-50">
    <div class="flex flex-wrap gap-3 mb-5">
      <div class="flex align-items-center border-1 border-500 border-round-2xl px-3 py-2 cursor-pointer">
        <label class="text-m text-gray-500 mr-1">Организация:</label>
        <select
          class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer"
        >
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>

      <div class="flex align-items-center border-1 border-500 border-round-2xl px-3 py-2 cursor-pointer">
        <label class="text-m text-gray-500 mr-1">Камеры:</label>
        <select
          class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer"
        >
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
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
  transform: translateY(-5px);
}
</style>
