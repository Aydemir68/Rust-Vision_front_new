<template>
  <div class="flex align-items-center justify-content-center min-h-screen w-full bg-gray-100 p-4">
    <div class="w-full max-w-6xl flex flex-column align-items-center gap-2">
      <div class="flex justify-content-between align-items-center w-full mb-2">
        <h2 class="text-2xl font-bold text-blue-500 m-0">Видео плееры</h2>
        <button class="p-2 border-none bg-transparent text-gray-400 hover:text-blue-500 border-circle cursor-pointer transition-colors" @click="$emit('back')">
          <span class="pi pi-times text-xl"></span>
        </button>
      </div>
      
      <div v-if="videos.length === 0" class="flex flex-column align-items-center gap-4 py-8">
        <span class="pi pi-video text-6xl text-gray-300"></span>
        <h3 class="text-xl font-semibold text-gray-500 m-0">Нет загруженных видео</h3>
        <p class="text-gray-400 text-center">Загрузите видео через раздел "Загрузить видео"</p>
      </div>
      
      <!--Карточки с видео-->
      <div v-else class="w-full flex flex-column gap-3">
        <div v-for="row in 2" :key="row" class="flex flex-row gap-3 w-full" style="height: 360px;">
          <div v-for="col in 2" :key="col" class="flex-1 flex align-items-center justify-content-center">
            <template v-if="videos[(row-1)*2 + (col-1)]">
              <VideoPlayer 
                :video="videos[(row-1)*2 + (col-1)]" 
                @delete-video="handleDeleteVideo" 
                class="w-full h-full max-w-36rem max-h-32rem"
              />
            </template>
            <!--Пустые карточки-->
            <template v-else>
              <div class="flex flex-column align-items-center justify-content-center gap-2 w-full h-full max-w-36rem max-h-32rem border-2 border-dashed border-gray-200 bg-white border-round-xl transition-all hover:border-blue-200 hover:bg-blue-50">
                <span class="pi pi-video text-5xl text-gray-300"></span>
                <span class="text-base text-gray-400 text-center">Пустой слот</span>
              </div>
            </template>
          </div>
        </div>
        <div class="flex justify-content-center mt-2">
          <div class="text-sm text-gray-500">
            Загружено видео: {{ videos.length }}/4
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VideoPlayer from './VideoPlayer.vue'

const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['back', 'delete-video'])

function handleDeleteVideo(videoId) {
  emit('delete-video', videoId)
}
</script> 