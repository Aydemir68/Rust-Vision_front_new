<script setup>
import Sidebar from './components/Sidebar.vue'
import DashboardHeader from './components/Header.vue'
import DashboardContent from './components/Content.vue'
</script>

<template>
    <div class="flex h-screen min-h-screen">
      <Sidebar />
      <div class="flex flex-column flex-1 min-h-0">
        <DashboardHeader />
        <div class="flex-1 min-h-0 overflow-auto">
          <DashboardContent />
        </div>
      </div>
    </div>
</template>
