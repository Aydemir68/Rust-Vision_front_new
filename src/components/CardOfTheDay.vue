<template>
  <div class="flex w-full h-full overflow-hidden">
    <div class="flex-1 p-4 flex flex-column transition-all duration-300">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex justify-content-between align-items-center gap-2">
          <h2 class="text-2xl font-bold text-blue-500 m-0">Карта дня: </h2>
          <h2 class="text-2xl font-bold text-gray-500 m-0">{{ pageTitle }}</h2>
        </div>
        <div>
          <button @click="panelOpen = true" class="p-2 border-round-md bg-gray-200 text-gray-700 font-bold border-none cursor-pointer hover:bg-gray-300 mr-2" title="Открыть панель организаций">
            <span class="pi pi-building"></span>
          </button>
          <button class="p-2 border-none bg-transparent text-gray-400 hover:text-blue-500 border-circle cursor-pointer" @click="$emit('close')" title="Закрыть">
            <span class="pi pi-times text-xl"></span>
          </button>
        </div>
      </div>

      <div v-if="uploading" class="flex-1 flex align-items-center justify-content-center">
        <div class="text-center">
          <span class="pi pi-spin pi-spinner text-blue-500 text-5xl"></span>
          <p class="text-lg text-gray-600 mt-2">Обработка файла...</p>
        </div>
      </div>
      <div v-else class="flex flex-column flex-1 overflow-hidden">
        <div class="flex-1 overflow-auto">
          <table class="w-full border-separate border-spacing-0">
            <thead>
              <tr class="bg-blue-50">
                <th v-for="col in columns" :key="col.key" class="p-3 text-center text-blue-500 font-semibold sticky top-0 bg-blue-50 z-1">{{ col.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!hasData" class="hover:bg-blue-100">
                <td :colspan="columns.length" class="text-center p-8 text-gray-500">
                  <div class="flex flex-column align-items-center gap-2">
                    <span class="pi pi-file-import text-4xl"></span>
                    <span>Данные не загружены.</span>
                    <span>Откройте панель справа, чтобы выбрать организацию и загрузить файл.</span>
                  </div>
                </td>
              </tr>
              <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-blue-100">
                <td v-for="col in columns" :key="col.key" class="p-2 border-bottom-1 border-gray-200">
                  <input v-model="row[col.key]" class="w-full p-3 border-round-md border-1 border-gray-300 focus:border-blue-400 outline-none" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-content-center mt-4 gap-2 pt-2">
          <button class="p-2 px-4 border-round-xl bg-blue-400 text-white font-bold border-none cursor-pointer hover:bg-blue-500" @click="clearTable">Очистить</button>
        </div>
      </div>
    </div>

    <OrganizationPanel
      v-model="panelOpen"
      @file-loaded="onFileLoaded"
      @loading-start="uploading = true"
      @loading-end="uploading = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import OrganizationPanel from './OrganizationPanel.vue';

defineEmits(['close']);

const panelOpen = ref(false);
const uploading = ref(false);
const selectedOrgName = ref('');
const selectedFileName = ref('');

const pageTitle = computed(() => {
  if (selectedOrgName.value && selectedFileName.value) {
    return `${selectedOrgName.value} (${selectedFileName.value})`;
  }
  return '';
});

const columnMapping = {
  pkoName: ['Наименование ПКО', 'Отдел'],
  workerName: ['ID работника ПКО', 'ФИО'],
  entryTime: ['t входа/t выхода', 'время', 'Время'],
  direction: ['Направление вход/выход', 'направление', 'Направление'],
  operationType: ['Вид операции'],
  operationContent: ['Содержание операции'],
  permissionTime: ['t Разрешения / t Сообщения о проведенной операции', 'Время разрешения/Сообщения о проведенной операции'],
  legalityCheck: ['Проверка правомерности операций'],
  totalPasses: ['Количество проходов всего'],
};

const columns = [
  { key: 'pkoName', label: 'Наименование ПКО' },
  { key: 'workerName', label: 'ID работника' },
  { key: 'entryTime', label: 'Время входа/выхода' },
  { key: 'direction', label: 'Направление' },
  { key: 'operationType', label: 'Вид операции' },
  { key: 'operationContent', label: 'Содержание' },
  { key: 'permissionTime', label: 'Время разрешения' },
  { key: 'legalityCheck', label: 'Проверка' },
  { key: 'totalPasses', label: 'Кол-во проходов' },
];

const rows = ref([]);
const hasData = computed(() => rows.value.length > 0);

function onFileLoaded({ parsedData, orgName, fileName }) {
  selectedOrgName.value = orgName;
  selectedFileName.value = fileName;

  rows.value = parsedData.map(fileRow => {
    const newRow = {};
    columns.forEach(col => newRow[col.key] = '');
    for (const key in columnMapping) {
      const possibleHeaders = columnMapping[key];
      const headerInFile = possibleHeaders.find(h => fileRow[h] !== undefined);
      if (headerInFile) {
        let value = fileRow[headerInFile];
        if (value instanceof Date) {
          value = value.toLocaleTimeString('ru-RU');
        }
        newRow[key] = value;
      }
    }
    return newRow;
  });
}

function clearTable() {
  rows.value = [];
  selectedOrgName.value = '';
  selectedFileName.value = '';
}
</script>