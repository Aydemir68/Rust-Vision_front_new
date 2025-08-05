<template>
  <div class="flex flex-column align-items-center w-full h-full bg-white border-round-xl border-1 border-gray-200 p-3 shadow-1 hover:shadow-2 cursor-pointer gap-2">
    <div class="w-full position-relative">
      <video 
        ref="videoEl" 
        :src="video ? video.blobUrl : ''" 
        controls 
        class="w-full border-round-lg"
        style="max-height: 280px; object-fit: cover; background: #f4f6fa;"
      />

       <!-- Название видео внутри карточки -->
        <div class="w-full text-center mt-2">
        <div class="text-base font-semibold text-gray-700" :title="video.name">
            {{ video.name }}
        </div>
        </div>

      <button
        v-if="video && video.status !== 'uploading' && video.status !== 'processing'"
        @click="requestDelete"
        class="position-absolute p-2 border-none bg-white text-red-400 hover:text-red-600 border-circle cursor-pointer transition-colors shadow-1"
        style="top: 12px; right: 12px;"
        title="Удалить видео"
      >
        <span class="pi pi-trash text-base"></span>
      </button>

      <div v-if="video && (video.status === 'uploading' || video.status === 'processing')" 
           class="position-absolute top-0 left-0 w-full h-full flex flex-column align-items-center justify-content-center bg-black-alpha-20 border-round-lg">
        <div class="flex flex-column align-items-center gap-2">
          <div class="w-3rem h-3rem border-2 border-blue-400 border-round-circle border-top-white animate-spin"></div>
          <p class="text-base text-gray-700 font-semibold m-0">
            {{ video.status === 'uploading' ? 'Загрузка...' : 'Обработка...' }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete-video'])
const videoEl = ref(null)

function requestDelete() {
  if (!props.video || !props.video.id) {
    console.error('Cannot emit delete event: video.id is missing.')
    return
  }
  emit('delete-video', props.video.id)
}
</script>

<style scoped>

</style>
