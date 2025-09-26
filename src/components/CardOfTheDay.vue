<template>
  <div class="flex w-full h-full overflow-hidden">
    <div class="flex-1 p-4 flex flex-column transition-all duration-300">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex justify-content-between align-items-center gap-2">
          <h2 class="text-2xl font-bold text-blue-500 m-0">Карта дня: </h2>
          <h2 class="text-2xl font-bold text-gray-500 m-0">{{ pageTitle }}</h2>
          <button 
        class="border-round-xl border-none bg-blue-200 p-2 px-4 text-blue-600 font-bold cursor-pointer hover:bg-blue-300 active:bg-blue-400 ml-6"
      >Выгрузить отчет</button>
        </div>
        <div>
          <button class="p-2 border-none bg-transparent text-gray-400 hover:text-blue-500 border-circle cursor-pointer" @click="emit('close')" title="Вернуться к задачам">
            <span class="pi pi-arrow-left text-xl"></span>
          </button>
        </div>
      </div>

      <div class="flex flex-column flex-1 overflow-hidden">
        <div class="flex-1 overflow-auto">
          <table class="w-full border-separate border-spacing-0">
            <thead>
              <tr class="bg-blue-50">
                <th v-for="col in columns" :key="col.key" class="p-3 text-center text-blue-500 font-semibold sticky top-0 bg-blue-50 z-1">{{ col.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!hasData">
                <td :colspan="columns.length" class="text-center p-8 text-gray-500">
                   <span>Нет данных для отображения.</span>
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
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps({
  task: { type: Object, required: false, default: null }
});

const rows = ref([]);

const pageTitle = computed(() => {
  if (props.task) {
    return `${props.task.cardName} (${props.task.orgName})`;
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

const hasData = computed(() => rows.value.length > 0);

function processTaskData(parsedData) {
  let lastPkoName = '';
  let lastWorkerName = ''; // Variable to store the last seen worker ID
  const processedRows = [];

  for (const fileRow of parsedData) {
    const newRow = {};
    columns.forEach(col => (newRow[col.key] = ''));

    // Map data from the parsed file row to our new row object
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

    // Skip rows that are completely empty after mapping
    if (Object.values(newRow).every(v => v === '' || v === null || v === undefined)) {
        continue;
    }

    // Fill in empty 'Наименование ПКО' with the last known value
    const pkoNameValue = newRow.pkoName ? String(newRow.pkoName).trim() : '';
    if (pkoNameValue) {
      lastPkoName = pkoNameValue;
    } else {
      newRow.pkoName = lastPkoName;
    }
    
    // Fill in empty 'ID работника' with the last known value
    const workerNameValue = newRow.workerName ? String(newRow.workerName).trim() : '';
    if(workerNameValue) {
        lastWorkerName = workerNameValue;
    } else {
        newRow.workerName = lastWorkerName;
    }
    
    processedRows.push(newRow);
  }
  rows.value = processedRows;
}

watch(() => props.task, (newTask) => {
  rows.value = [];
  if (newTask && newTask.parsedData) {
    processTaskData(newTask.parsedData);
  }
}, { immediate: true });

onMounted(() => {
  if (props.task && props.task.parsedData) {
    processTaskData(props.task.parsedData);
  }
});
</script>
