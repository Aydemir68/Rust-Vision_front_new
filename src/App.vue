<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import CreateOrganization from './components/CreateOrganization.vue'
import VideoUpload from './components/VideoUpload.vue'
import VideoGrid from './components/VideoGrid.vue'

const showCreateOrg = ref(false)
const showVideoUpload = ref(false)
const showVideoGrid = ref(false)
const videos = ref([])

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
</script>

<template>
  <div class="flex h-screen min-h-screen">
    <Sidebar 
      @create-organization="handleCreateOrganization"
      @upload-video="handleUploadVideo"
      @show-videos="handleShowVideos"
    />
    <div class="flex flex-column flex-1 min-h-0">
      <Header />
      <div class="flex-1 min-h-0 overflow-auto">
        <CreateOrganization v-if="showCreateOrg" @back="handleBackToDashboard" />
        <VideoUpload v-else-if="showVideoUpload" @back="handleBackToDashboard" @videos-uploaded="handleVideosUploaded" />
        <VideoGrid v-else-if="showVideoGrid" :videos="videos" @back="handleBackToDashboard" @delete-video="handleDeleteVideo" />
        <Content v-else />
      </div>
    </div>
  </div>
</template>
