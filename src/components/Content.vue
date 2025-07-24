<template>
  <main class="flex-1 bg-surface-50 p-4">
    <!-- Фильтры -->
    <div class="flex gap-3 mb-5">
      <div class="flex align-items-center border-1 border-300 border-round-2xl px-3 py-2">
        <label class="text-m text-gray-500 mr-2">Организация:</label>
        <select class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer">
          <option>Все</option>
          <option>По алфавиту (от А до Я)</option>
          <option>По алфавиту (от Я до А)</option>
        </select>
      </div>
      <div class="flex align-items-center border-1 border-300 border-round-2xl px-3 py-2">
        <label class="text-m text-gray-500 mr-2">Камеры:</label>
        <select class="text-sm font-semibold border-none outline-none surface-0 cursor-pointer">
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
            <!--<span class="w-full" style="height:24px;background:linear-gradient(90deg,#e0e7ff 60%,#fff 100%);"></span>-->
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
        <!--Активные видео-->
        <div class="col-12 p-2">
          <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-2xl p-4 flex flex-column gap-3">
            <span class="text-sm text-gray-500 mb-2">Активные видео</span>
            <div class="flex flex-column gap-2">
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">video20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-400 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:80%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">80%</span>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">office_entrance_20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-400 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:45%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">45%</span>
                </div>
              </div>
              <div class="flex align-items-center justify-content-between p-2 border-round-xl bg-surface-100 gap-3">
                <span class="pi pi-play-circle text-lg text-gray-600 flex-shrink-0"></span>
                <span class="font-medium text-gray-800 mr-8" style="min-width:180px;">parking_20_06_2025.mp4</span>
                <div class="flex align-items-center gap-2 w-full">
                  <div class="bg-orange-400 border-round-xl flex-grow-1" style="height:12px; min-width:100px; max-width:400px; overflow:hidden;">
                    <div class="bg-orange-500 border-round-xl" style="height:12px; width:100%;"></div>
                  </div>
                  <span class="text-xs text-gray-500" style="min-width:36px;">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>

      

      <!-- График -->
      <div class="w-full lg:w-3 p-2">
        <div class="custom-hover shadow-1 cursor-pointer surface-card border-round-xl p-4 h-full flex flex-column">
          <span class="text-sm text-gray-500 mb-3">Активность за неделю</span>
          <div class="flex align-items-end gap-2 h-10rem w-full">
            <div class="bg-blue-200" style="width:16%;height:20%;border-radius:8px;"></div>
            <div class="bg-blue-200" style="width:16%;height:40%;border-radius:8px;"></div>
            <div class="bg-blue-400" style="width:16%;height:60%;border-radius:8px;"></div>
            <div class="bg-blue-400" style="width:16%;height:80%;border-radius:8px;"></div>
            <div class="bg-blue-500" style="width:16%;height:60%;border-radius:8px;"></div>
            <div class="bg-blue-100" style="width:16%;height:30%;border-radius:8px;"></div>
          </div>
          <div class="flex justify-content-between text-xs text-gray-400 mt-2">
            <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span>
          </div>
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
