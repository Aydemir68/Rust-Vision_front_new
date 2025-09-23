<template>
  <div class="flex w-full h-full overflow-hidden">
    <div class="flex-1 p-4 flex flex-column transition-all duration-300">
      <div class="flex justify-content-between align-items-center mb-4">
        <div class="flex justify-content-between align-items-center gap-2">
          <h2 class="text-2xl font-bold text-blue-500 m-0">Карта дня: </h2>
          <h2 class="text-2xl font-bold text-gray-500 m-0">{{ pageTitle }}</h2>
        </div> 
        <div>
          <button @click="panelOpen = !panelOpen" class="p-2 border-round-md bg-gray-200 text-gray-700 font-bold border-none cursor-pointer hover:bg-gray-300 mr-2" title="Открыть панель организаций">
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
          <!--
          <button class="p-2 px-4 border-round-xl bg-blue-400 text-white font-bold border-none cursor-pointer hover:bg-blue-500" @click="addRow">+</button>
          <button class="p-2 px-4 border-round-xl bg-red-400 text-white font-bold border-none cursor-pointer hover:bg-red-500" @click="deleteRow">-</button>
          -->
          <button class="p-2 px-4 border-round-xl bg-blue-400 text-white font-bold border-none cursor-pointer hover:bg-blue-500" @click="clearTable">Очистить</button>
        </div>
      </div>
    </div>

    <div :class="['organization-panel', { 'is-open': panelOpen }]">
      <div class="p-4 h-full flex flex-column">
        <div class="flex justify-content-between align-items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800 m-0">Организации</h3>
            <button @click="panelOpen = false" class="p-2 border-none bg-transparent text-gray-500 hover:text-gray-800 border-circle cursor-pointer">
                <span class="pi pi-times"></span>
            </button>
        </div>

        <div v-if="loadingOrgs" class="text-center flex-1 flex align-items-center justify-content-center">
          <span class="pi pi-spin pi-spinner text-gray-500 text-3xl"></span>
        </div>
        <div v-else-if="orgError" class="text-red-500 bg-red-100 p-2 border-round-md">{{ orgError }}</div>
        <ul v-else class="list-none p-0 m-0 flex flex-column gap-2 overflow-y-auto">
          <li v-for="org in organizations" :key="org.id">
            <div class="org-item" @click="toggleOrg(org.id)">
              <span class="font-semibold">{{ org.name }}</span>
              <span :class="['pi', expandedOrg === org.id ? 'pi-chevron-down' : 'pi-chevron-right']"></span>
            </div>
            <div v-if="expandedOrg === org.id" class="p-3 bg-gray-200 border-round-md mt-2">
              <input type="file" ref="fileInput" @change="handleFileUpload(org.id, $event)" accept=".xls,.xlsx,.xlsm" class="file-input" />
              <button @click="triggerFileInput" class="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white border-none border-round-md cursor-pointer flex align-items-center justify-content-center gap-2">
                <span class="pi pi-upload"></span>
                <span>Выбрать файл</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { mockGetOrganizations, mockUploadAndParseFile } from './mockApi.js';

const USE_MOCK_API = true;

defineEmits(['close']);

const panelOpen = ref(false);
const organizations = ref([]);
const loadingOrgs = ref(true);
const orgError = ref(null);
const expandedOrg = ref(null);
const uploading = ref(false);
const selectedOrgName = ref('');
const selectedFileName = ref('');

const pageTitle = computed(() => {
  if (selectedOrgName.value && selectedFileName.value) {
    return `${selectedOrgName.value} (${selectedFileName.value})`;
  }
  return '';
});

// Карта соответствия заголовков в файле и ключей в нашей таблице.
// Ключ - это название столбца в таблице, значение - массив возможных названий в Excel.
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


onMounted(() => {
  fetchOrganizations();
});

async function fetchOrganizations() {
  loadingOrgs.value = true;
  orgError.value = null;
  try {
    if (USE_MOCK_API) {
      organizations.value = await mockGetOrganizations();
    } else {
      const response = await fetch('/api/v1/organizations');
      if (!response.ok) throw new Error('Не удалось получить список организаций');
      organizations.value = await response.json();
    }
  } catch (e) {
    orgError.value = e.message;
  } finally {
    loadingOrgs.value = false;
  }
}

function toggleOrg(orgId) {
  expandedOrg.value = expandedOrg.value === orgId ? null : orgId;
}

function triggerFileInput(event) {
    const input = event.target.closest('div').querySelector('input[type="file"]');
    if (input) {
        input.click();
    }
}

async function handleFileUpload(orgId, event) {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  panelOpen.value = false;
  const dayMapId = 'mock-day-map-id';

  try {
      let parsedData;
      if (USE_MOCK_API) {
          parsedData = await mockUploadAndParseFile(dayMapId, file);
      } else {
          // Реальная логика: POST /day-maps/{day_map_id}/entries
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch(`/api/v1/day-maps/${dayMapId}/entries`, {
              method: 'POST',
              body: formData, 
          });
          if (!response.ok) throw new Error('Ошибка загрузки файла');
          parsedData = await response.json();
      }
      
      selectedOrgName.value = organizations.value.find(o => o.id === orgId)?.name || 'Неизвестная организация';
      selectedFileName.value = file.name;

      // Преобразуем данные из файла в формат для таблицы
      rows.value = parsedData.map(fileRow => {
          const newRow = {};
          // Заполняем newRow пустыми значениями для всех колонок
          columns.forEach(col => newRow[col.key] = '');

          // Итерируемся по каждой колонке нашей таблицы
          for (const key in columnMapping) {
              // Находим соответствующее имя заголовка из файла
              const possibleHeaders = columnMapping[key];
              const headerInFile = possibleHeaders.find(h => fileRow[h] !== undefined);
              if (headerInFile) {
                  let value = fileRow[headerInFile];
                  // Форматируем дату, если это необходимо
                  if (value instanceof Date) {
                      value = value.toLocaleTimeString('ru-RU');
                  }
                  newRow[key] = value;
              }
          }
          return newRow;
      });

  } catch (error) {
      console.error("Ошибка при обработке файла:", error);
      alert(error.message);
      rows.value = []; // Очищаем таблицу в случае ошибки
  } finally {
      uploading.value = false;
      if(event.target) event.target.value = '';
  }
}

function clearTable() {
    rows.value = [];
    selectedOrgName.value = '';
    selectedFileName.value = '';
}

function addRow() {
    rows.value.push({ pkoName: '', workerName: '', entryTime: '', direction: '', operationType: '', operationContent: '', permissionTime: '', legalityCheck: '', totalPasses: '' });
}

function deleteRow() {
  if (rows.value.length > 0) {
    rows.value.pop();
  }
}
</script>

<style scoped>
.organization-panel {
  width: 0;
  min-width: 0;
  background-color: #f3f4f6; /* bg-gray-100 */
  transition: width 0.3s ease-in-out, min-width 0.3s ease-in-out;
  overflow: hidden;
  height: 100%;
  border-left: 1px solid #e5e7eb; /* border-gray-200 */
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

.organization-panel.is-open {
  width: 320px;
  min-width: 320px;
}

.org-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #ffffff; /* bg-white */
  color: #374151; /* text-gray-700 */
  border-radius: 0.5rem; /* border-round-lg */
  border: 1px solid #e5e7eb;
  cursor: pointer;
}
.org-item:hover {
  background-color: #f9fafb; /* bg-gray-50 */
}

.file-input {
  display: none;
}
</style>