<template>
  <div class="w-full" style="max-width: 700px; margin: 0 auto;">
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold text-blue-500">Создать новую задачу</h2>
      <p class="text-gray-500">Заполните все поля для создания задачи.</p>
    </div>

    <form @submit.prevent="createTask" class="flex flex-column gap-4">
      <div class="flex flex-column">
        <label for="cardName" class="font-semibold mb-2 text-gray-700">Название карты дня</label>
        <InputText
          id="cardName"
          v-model="cardName"
          placeholder="Например, Отчет за 24.09.2025"
          :class="{ 'p-invalid': !cardName && triedToSubmit }"
        />
      </div>

      <div class="flex flex-column">
        <label for="organization" class="font-semibold mb-2 text-gray-700">Организация</label>
        <Dropdown
          v-model="selectedOrg"
          :options="organizations"
          optionLabel="name"
          placeholder="Выберите организацию"
          class="w-full"
          :class="{ 'p-invalid': !selectedOrg && triedToSubmit }"
        />
      </div>

      <div class="flex flex-column">
        <label for="xls-upload" class="font-semibold mb-2 text-gray-700">Файл отчета (.xls, .xlsx) (необязательно)</label>
        <div
          @click="triggerFileInput('xlsInput')"
          @dragover.prevent @dragenter.prevent @drop.prevent="handleFileDrop"
          class="flex align-items-center justify-content-center p-4 border-2 border-dashed border-gray-300 border-round-md cursor-pointer hover:border-blue-400 transition-colors"
           :class="{ 'border-blue-500': file }"
        >
          <input ref="xlsInput" type="file" @change="handleFileSelect" accept=".xls,.xlsx" class="hidden" />
          <div class="text-center text-gray-500">
            <i class="pi pi-upload text-3xl mb-2"></i>
            <p v-if="!file">Перетащите или <span class="text-blue-500 font-semibold">выберите файл</span></p>
            <p v-else class="text-blue-500 font-semibold">Выбран файл: {{ file.name }}</p>
          </div>
        </div>
      </div>

      <div class="flex flex-column">
         <label for="folder-upload" class="font-semibold mb-2 text-gray-700">Папка с видео (необязательно)</label>
         <div
           @click="triggerFileInput('folderInput')"
           class="flex align-items-center justify-content-center p-4 border-2 border-dashed border-gray-300 border-round-md cursor-pointer hover:border-blue-400 transition-colors"
           :class="{ 'border-blue-500': folderName }"
         >
           <input ref="folderInput" type="file" webkitdirectory directory multiple @change="handleFolderSelect" class="hidden" />
           <div class="text-center text-gray-500">
              <i class="pi pi-folder-open text-3xl mb-2"></i>
              <p v-if="!folderName">Нажмите, чтобы <span class="text-blue-500 font-semibold">выбрать папку</span></p>
              <p v-else class="text-blue-600 font-semibold">Выбрана папка: {{ folderName }}</p>
           </div>
         </div>
      </div>

      <button ref="submitButton" type="submit" class="hidden"></button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { api } from './mockApi.js';

// defineExpose для вызова метода из родителя
defineExpose({ createTask });

const emit = defineEmits(['task-created', 'loading-start', 'loading-end']);

const organizations = ref([]);
const cardName = ref('');
const selectedOrg = ref(null);
const file = ref(null);
const folderName = ref('');
const xlsInput = ref(null);
const folderInput = ref(null);
const isLoading = ref(false);
const triedToSubmit = ref(false);

onMounted(async () => {
  organizations.value = await api.getOrganizations();
});

const triggerFileInput = (refName) => {
  if (refName === 'xlsInput') xlsInput.value.click();
  if (refName === 'folderInput') folderInput.value.click();
};
const handleFileSelect = (event) => { file.value = event.target.files[0]; };
const handleFileDrop = (event) => { file.value = event.dataTransfer.files[0]; };
const handleFolderSelect = (event) => {
    if (event.target.files.length > 0) {
        const fullPath = event.target.files[0].webkitRelativePath;
        folderName.value = fullPath.split('/')[0];
    }
};

async function createTask() {
  triedToSubmit.value = true;
  // Валидация только для обязательных полей
  if (!cardName.value.trim() || !selectedOrg.value) {
    return false;
  }
  
  isLoading.value = true;
  emit('loading-start');
  try {
    let parsedData = null;
    // Парсим файл, только если он был выбран
    if (file.value) {
      parsedData = await api.uploadAndParseFile(selectedOrg.value.id, file.value);
    }
    
    // Вызываем API для создания задачи
    const newTask = await api.createTask({
      cardName: cardName.value,
      orgName: selectedOrg.value.name,
      fileName: file.value ? file.value.name : null,
      folderName: folderName.value || null,
      parsedData: parsedData,
    });
    
    emit('task-created', newTask);
    return true; // Успех
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
    return false; // Неудача
  } finally {
    isLoading.value = false;
    emit('loading-end');
  }
}
</script>

<style>
.p-invalid {
  border-color: #f87171 !important;
}
</style>