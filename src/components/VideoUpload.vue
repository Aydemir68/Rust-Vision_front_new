<template>
  <div class="flex align-items-center justify-content-center min-h-screen w-full bg-gray-100 p-4">
    <div class="surface-card border-round-2xl shadow-2 p-6 w-full max-w-2xl border-1 border-200 flex flex-column align-items-center gap-4">
      <div class="flex justify-content-between align-items-center w-full mb-3">
        <h2 class="text-2xl font-bold text-blue-400 m-0">Загрузка видео</h2>
        <button class="p-2 border-none bg-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-50 border-circle cursor-pointer transition-colors transition-duration-300" @click="$emit('back')">
          <span class="pi pi-times text-xl"></span>
        </button>
      </div>
      
      <div class="w-full">
        <div class="text-center mb-4">
          <p class="text-gray-600 mb-3">Выберите видео файлы (MP4, AVI, MOV) - максимум 4 файла</p>
          <input 
            ref="fileInput" 
            type="file" 
            multiple 
            accept="video/*" 
            class="hidden" 
            @change="handleFileSelect"
          />
          <button 
            @click="$refs.fileInput.click()"
            class="p-4 border-2 border-dashed border-blue-300 border-round-xl bg-blue-50 hover:bg-blue-100 transition-colors transition-duration-300 cursor-pointer w-full"
          >
            <div class="flex flex-column align-items-center gap-3">
              <span class="pi pi-upload text-3xl text-blue-400"></span>
              <span class="text-blue-600 font-semibold">Выбрать файлы</span>
              <span class="text-sm text-gray-500">или перетащите файлы сюда</span>
            </div>
          </button>
        </div>
        
        <div v-if="selectedFiles.length > 0" class="w-full">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Выбранные файлы:</h3>
          <div class="flex flex-column gap-3">
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="flex align-items-center justify-content-between p-3 bg-gray-50 border-round-lg border-1 border-gray-200"
            >
              <div class="flex align-items-center gap-3">
                <span class="pi pi-video text-blue-400 text-lg"></span>
                <div class="flex flex-column">
                  <span class="font-semibold text-gray-700">{{ file.name }}</span>
                  <span class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</span>
                </div>
              </div>
              <button 
                @click="removeFile(index)"
                class="p-2 border-none bg-transparent text-red-400 hover:text-red-600 hover:bg-red-50 border-circle cursor-pointer transition-colors transition-duration-300"
              >
                <span class="pi pi-trash text-lg"></span>
              </button>
            </div>
          </div>
          
          <div class="flex justify-content-center mt-4">
            <button 
              @click="uploadFiles"
              :disabled="selectedFiles.length === 0"
              class="p-3 px-6 bg-blue-400 hover:bg-blue-500 text-white border-none border-round-xl font-semibold cursor-pointer transition-colors transition-duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="pi pi-upload mr-2"></span>
              Загрузить видео
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['back', 'videos-uploaded'])

const fileInput = ref(null)
const selectedFiles = ref([])

function handleFileSelect(event) {
  const files = Array.from(event.target.files)
  const videoFiles = files.filter(file => file.type.startsWith('video/'))
  
  if (selectedFiles.value.length + videoFiles.length > 4) {
    alert('Максимум 4 видео файла!')
    return
  }
  
  selectedFiles.value.push(...videoFiles)
  event.target.value = '' // Сброс input
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function uploadFiles() {
  if (selectedFiles.value.length === 0) return
  
  // Создаем массив видео объектов
  const videos = selectedFiles.value.map((file, index) => ({
    id: Date.now() + index,
    name: file.name,
    size: file.size,
    uploadDate: new Date(),
    duration: Math.floor(Math.random() * 300) + 60, // Случайная длительность 1-6 минут
    status: 'ready',
    blobUrl: URL.createObjectURL(file)
  }))
  
  emit('videos-uploaded', videos)
  selectedFiles.value = []
}
</script> 