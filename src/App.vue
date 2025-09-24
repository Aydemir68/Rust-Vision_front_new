<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import CreateOrganization from './components/CreateOrganization.vue'
import VideoUpload from './components/VideoUpload.vue'
import VideoGrid from './components/VideoGrid.vue'
import CardOfTheDay from './components/CardOfTheDay.vue'
import Tasks from './components/Tasks.vue'

const showCreateOrg = ref(false)
const showVideoUpload = ref(false)
const showVideoGrid = ref(false)
const videos = ref([])
const showTasks = ref(false)
const showCardOfTheDay = ref(false)
const selectedTask = ref(null)

function handleCreateOrganization() {
  showCreateOrg.value = true
  showVideoUpload.value = false
  showVideoGrid.value = false
}

function handleUploadVideo() {
  showVideoUpload.value = true
  showCreateOrg.value = false
  showVideoGrid.value = false
}

function handleShowVideos() {
  showVideoGrid.value = true
  showCreateOrg.value = false
  showVideoUpload.value = false
}

function handleBackToDashboard() {
  showCreateOrg.value = false
  showVideoUpload.value = false
  showVideoGrid.value = false
}

function handleVideosUploaded(newVideos) {
  videos.value.push(...newVideos)
  showVideoUpload.value = false
  showVideoGrid.value = true
}

function handleDeleteVideo(videoId) {
  const index = videos.value.findIndex(video => video.id === videoId)
  if (index !== -1) {
    videos.value.splice(index, 1)
  }
}

function handleShowCardOfTheDay() {
  // Показываем список задач; выбор задачи откроет карту дня
  showTasks.value = true
  showCreateOrg.value = false
  showVideoUpload.value = false
  showVideoGrid.value = false
}
function handleCloseCardOfTheDay() {
  showCardOfTheDay.value = false
  selectedTask.value = null
  // Возвращаемся к списку задач после закрытия карты дня
  showTasks.value = true
}

function handleViewTask(task) {
  selectedTask.value = task
  showCardOfTheDay.value = true
  showTasks.value = false
}

function resetAllViews() {
  showCreateOrg.value = false
  showVideoUpload.value = false
  showVideoGrid.value = false
  showTasks.value = false
  showCardOfTheDay.value = false
  selectedTask.value = null
}
</script>

<template>
  <div class="flex h-screen min-h-screen">
    <Sidebar 
      @create-organization="handleCreateOrganization"
      @upload-video="handleUploadVideo"
      @show-videos="handleShowVideos"
      @show-card-of-the-day="handleShowCardOfTheDay"
    />
    <div class="flex flex-column flex-1 min-h-0">
      <Header />
      <div class="flex-1 min-h-0 overflow-auto">
        <CreateOrganization v-if="showCreateOrg" @back="handleBackToDashboard" />
        <VideoUpload v-else-if="showVideoUpload" @back="handleBackToDashboard" @videos-uploaded="handleVideosUploaded" />
        <VideoGrid v-else-if="showVideoGrid" :videos="videos" @back="handleBackToDashboard" @delete-video="handleDeleteVideo" />
        <Tasks v-else-if="showTasks" @view-task="handleViewTask" />
        <CardOfTheDay v-else-if="showCardOfTheDay" :task="selectedTask" @close="handleCloseCardOfTheDay" />
        <Content v-else />
      </div>
    </div>
  </div>
</template>
