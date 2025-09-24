<template>
  <div class="bg-gray-100">
    <aside class="surface-200 w-16rem border-round-right-2xl flex flex-column p-4 h-screen min-h-screen">
    <div class="mb-6 text-center font-bold text-3xl text-blue-400">RustVision</div>
    <div class="flex flex-column gap-4">
      <button class="custom-hover w-full p-3 border-none border-round-2xl text-lg font-semibold text-center bg-transparent flex align-items-center gap-2
      text-gray-500 hover:bg-blue-400 hover:text-blue-700 hover:shadow-2 cursor-pointer"
      @click="handleCreateOrg">
        <span class="pi pi-building-columns text-lg flex-shrink-0"></span>
        <span class="flex-1 text-center">Создать организацию</span>
      </button>
      <button class="custom-hover w-full p-3 border-none border-round-2xl text-lg font-semibold text-center bg-transparent flex align-items-center gap-2
      text-gray-500 hover:bg-blue-400 hover:text-blue-700 hover:shadow-2 cursor-pointer"
      @click="handleShowCardOfTheDay">
        <span class="pi pi-clipboard text-lg flex-shrink-0"></span>
        <span class="flex-1 text-center">Задачи</span>
      </button>
      <button class="custom-hover w-full p-3 border-none border-round-2xl text-lg font-semibold text-center bg-transparent flex align-items-center gap-2
      text-gray-500 hover:bg-blue-400 hover:text-blue-700 hover:shadow-2 cursor-pointer">
        <span class="pi pi-video text-lg flex-shrink-0"></span>
        <span class="flex-1 text-center">Пресеты</span>
      </button>
      <button class="custom-hover w-full p-3 border-none border-round-2xl text-lg font-semibold text-center bg-transparent flex align-items-center gap-2
      text-gray-500 hover:bg-blue-400 hover:text-blue-700 hover:shadow-2 cursor-pointer"
      @click="handleShowVideos">
        <span class="pi pi-play-circle text-lg flex-shrink-0"></span>
        <span class="flex-1 text-center">Показать видео</span>
      </button>
    </div>
  </aside>
  </div>
  
  
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['create-organization', 'upload-video', 'show-videos', 'show-card-of-the-day'])

function handleCreateOrg() {
  emit('create-organization')
}

function handleUploadVideo() {
  emit('upload-video')
}

function handleShowVideos() {
  emit('show-videos')
}

function handleShowCardOfTheDay() {
  emit('show-card-of-the-day')
}
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