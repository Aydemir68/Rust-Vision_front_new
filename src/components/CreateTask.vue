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
          :loading="isOrgsLoading"
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
         <label for="folder-upload" class="font-semibold mb-2 text-gray-700">Путь к папке с видео (необязательно)</label>
         <InputText
           v-model="folderPath"
           placeholder="Например: /Users/me/Videos/ProjectA"
           class="w-full"
         />
      </div>

      <button ref="submitButton" type="submit" class="hidden"></button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { api } from '@/api.js';
import * as XLSX from 'xlsx';

// defineExpose для вызова метода из родителя
defineExpose({ createTask });

const emit = defineEmits(['task-created', 'loading-start', 'loading-end']);

const organizations = ref([]);
const cardName = ref('');
const selectedOrg = ref(null);
const file = ref(null);
const folderPath = ref('');
const xlsInput = ref(null);
const isLoading = ref(false);
const isOrgsLoading = ref(false); // Для индикатора загрузки организаций
const triedToSubmit = ref(false);

onMounted(async () => {
  isOrgsLoading.value = true;
  try {
    organizations.value = await api.getOrganizations();
  } catch(e) {
    console.error("Не удалось загрузить организации:", e);
    // Можно добавить обработку ошибки, например, показать уведомление
  } finally {
    isOrgsLoading.value = false;
  }
});

const triggerFileInput = (refName) => {
  if (refName === 'xlsInput') xlsInput.value.click();
};
const handleFileSelect = (event) => { file.value = event.target.files[0]; };
const handleFileDrop = (event) => { file.value = event.dataTransfer.files[0]; };

function storageKey(taskId) {
  return `rv_task_parsed_${taskId}`;
}

function saveTaskStorage(taskId, partial) {
  try {
    const raw = sessionStorage.getItem(storageKey(taskId));
    const existing = raw ? JSON.parse(raw) : {};
    const merged = { ...(existing && typeof existing === 'object' ? existing : {}), ...partial };
    sessionStorage.setItem(storageKey(taskId), JSON.stringify(merged));
  } catch (e) {
    // ignore
  }
}

async function createTask() {
  triedToSubmit.value = true;
  if (!cardName.value.trim() || !selectedOrg.value) {
    return false;
  }

  isLoading.value = true;
  emit('loading-start');
  try {
    const dayMap = await api.createDayMap(selectedOrg.value.id, { title: cardName.value });

    if (folderPath.value) {
      await api.scanVideos(dayMap.id, folderPath.value);
    }
    
    let parsedData = null;
    if (file.value) {
      parsedData = await parseXlsFile(file.value);
    }
    
    const newTask = {
      id: dayMap.id,
      cardName: dayMap.title,
      orgName: selectedOrg.value.name,
      fileName: file.value ? file.value.name : null,
      folderName: folderPath.value || null,
      parsedData: parsedData,
      status: 'не начата',
    };

    // Persist in session so Tasks.vue can restore the state
    saveTaskStorage(newTask.id, {
      fileName: newTask.fileName || null,
      folderName: newTask.folderName || null,
      parsedData: newTask.parsedData || null,
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

function parseXlsFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
          if (!jsonDataRaw || jsonDataRaw.length === 0) {
            throw new Error("Файл пуст или не содержит данных.");
          }
  
          let headerRowIndex = -1;
          let subHeaderRowIndex = -1;
  
          for (let i = 0; i < Math.min(10, jsonDataRaw.length); i++) {
              const row = jsonDataRaw[i] || [];
              const normalizedRow = row.map(cell => String(cell).toLowerCase().trim());
              if (normalizedRow.includes('фио') || normalizedRow.includes('отдел')) {
                  headerRowIndex = i;
                  break;
              }
          }
          if (headerRowIndex === -1) throw new Error("Не удалось найти основную строку с заголовками (ожидались 'ФИО' или 'Отдел').");
          
          if (jsonDataRaw.length > headerRowIndex + 1) {
              const nextRow = jsonDataRaw[headerRowIndex + 1] || [];
              const normalizedNextRow = nextRow.map(cell => String(cell).toLowerCase().trim());
              if (normalizedNextRow.includes('время') || 'направление') {
                  subHeaderRowIndex = headerRowIndex + 1;
              }
          }
  
          const mainHeaders = [...jsonDataRaw[headerRowIndex]];
          
          for (let i = 1; i < mainHeaders.length; i++) {
              if (mainHeaders[i] === '' && mainHeaders[i-1] !== '') {
                  mainHeaders[i] = mainHeaders[i-1];
              }
          }
  
          const subHeaders = subHeaderRowIndex !== -1 ? jsonDataRaw[subHeaderRowIndex] : [];
          const dataStartIndex = subHeaderRowIndex !== -1 ? subHeaderRowIndex + 1 : headerRowIndex + 1;
  
          const finalHeaders = mainHeaders.map((header, index) => {
              const mainHeader = String(header).trim();
              const subHeader = String(subHeaders[index] || '').trim();
              if (mainHeader.toLowerCase().includes('событие') && subHeader) {
                  return subHeader;
              }
              return mainHeader;
          });
  
          const dataRows = jsonDataRaw.slice(dataStartIndex);
  
          const finalData = dataRows.map(row => {
              const rowObject = {};
              finalHeaders.forEach((header, index) => {
                  if (header) {
                      rowObject[header] = row[index];
                  }
              });
              return rowObject;
          }).filter(obj => Object.values(obj).some(val => val !== '' && val !== null && val !== undefined));
  
          resolve(finalData);
  
        } catch (err) {
          reject(new Error(err.message || 'Не удалось прочитать данные из файла.'));
        }
      };
  
      reader.onerror = (err) => {
        reject(new Error('Произошла ошибка при чтении файла.'));
      };
  
      reader.readAsBinaryString(file);
    });
}

</script>

<style>
.p-invalid {
  border-color: #f87171 !important;
}
</style>