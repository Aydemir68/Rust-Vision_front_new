<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import CreateOrganization from './components/CreateOrganization.vue'

const showCreateOrg = ref(false)

function handleCreateOrganization() {
  showCreateOrg.value = true
}

function handleBackToDashboard() {
  showCreateOrg.value = false
}
</script>

<template>
  <div class="flex h-screen min-h-screen">
    <Sidebar @create-organization="handleCreateOrganization" />
    <div class="flex flex-column flex-1 min-h-0">
      <Header />
      <div class="flex-1 min-h-0 overflow-auto">
        <CreateOrganization v-if="showCreateOrg" @back="handleBackToDashboard" />
        <Content v-else />
      </div>
    </div>
  </div>
</template>
