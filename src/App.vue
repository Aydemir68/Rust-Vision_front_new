<script setup>
import Sidebar from './components/Sidebar.vue'
import DashboardHeader from './components/Header.vue'
import DashboardContent from './components/Content.vue'
</script>

<template>
    <div class="flex">
      <Sidebar />
      <div class="flex flex-column flex-1">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
</template>
