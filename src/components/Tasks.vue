<template>
  <div class="flex flex-column h-full w-full p-4 bg-gray-50">
    <div class="flex flex-column gap-3 mb-4">
      <div class="flex justify-content-between align-items-center">
        <h1 class="text-3xl font-bold text-gray-700 m-0">Задачи</h1>
        <Button label="Создать задачу" icon="pi pi-plus" class="bg-blue-500 border-0 border-round-xl hover:bg-blue-600" @click="isCreateDialogVisible = true" />
      </div>
      <div class="flex gap-3 flex-wrap justify-content-betweenalign-items-center">
        <div class="flex-1 min-w-12rem " style="max-width: 420px;">
          <span class="flex w-full justify-content-between gap-2 ">
            <InputText v-model="searchQuery" placeholder="Поиск по названию, организации или файлу" class="w-full" />
          </span>
        </div>
        <Dropdown class="w-12rem" v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Статус" />
      </div>
    </div>

    <div v-if="tasks.length === 0" class="flex-grow-1 flex align-items-center justify-content-center text-center text-gray-500">
        <p>На данный момент задач нет</p>
    </div>
    <div v-else class="flex-grow-1 overflow-auto">
      <Accordion :activeIndex.sync="activeAccordionIndex">
        <AccordionTab v-for="task in filteredTasks" :key="task.id">
          <template #header>
            <div class="flex align-items-center justify-content-between w-full">
              <div class="flex align-items-center gap-3">
                <div class="w-2rem h-2rem flex align-items-center justify-content-center border-circle bg-blue-50 text-blue-500">
                  <i class="pi pi-inbox"></i>
                </div>
                <div class="flex flex-column">
                  <span class="font-bold text-gray-800">{{ task.cardName }}</span>
                  <small class="text-color-secondary">{{ task.orgName }}</small>
                </div>
              </div>
              <Tag :value="task.status" :severity="getStatusSeverity(task.status)" />
            </div>
          </template>
          
          <div class="p-4 surface-card border-round-lg shadow-2">
            <div class="grid text-gray-700">
              <div class="col-12 md:col-6 lg:col-4 flex align-items-center gap-2">
                <i class="pi pi-building text-blue-400"></i>
                <span class="font-semibold">Организация:</span>
                <span>{{ task.orgName }}</span>
              </div>
              <div class="col-12 md:col-6 lg:col-4 flex align-items-center gap-2">
                <i class="pi pi-file-excel text-green-400"></i>
                <span class="font-semibold">Файл отчета:</span>
                <span :class="{'text-gray-400': !task.fileName}">{{ task.fileName || 'не загружен' }}</span>
              </div>
              <div v-if="task.folderName !== undefined" class="col-12 md:col-6 lg:col-4 flex align-items-center gap-2">
                <i class="pi pi-folder-open text-yellow-500"></i>
                <span class="font-semibold">Папка с видео:</span>
                <span :class="{'text-gray-400': !task.folderName}">{{ task.folderName || 'не загружена' }}</span>
              </div>
            </div>
            <Divider />
            <div class="flex justify-content-end gap-2">
              <Button 
                v-if="!task.fileName || !task.folderName"
                label="Загрузить файлы" 
                icon="pi pi-upload" 
                class="bg-gray-500 border-0 hover:bg-gray-600"
                @click="openUploadDialog(task)"
              />
              <Button 
                label="Запустить" 
                icon="pi pi-play" 
                class="bg-green-400 border-0 hover:bg-green-500"
                :disabled="!task.fileName || !task.folderName || task.status === 'в процессе' || isStarting(task.id)"
                :loading="isStarting(task.id)"
                @click="startTask(task)"
              />
              <Button label="Открыть карту дня" icon="pi pi-arrow-right" class="bg-blue-500 border-0 hover:bg-blue-600" :disabled="!task.parsedData" @click="$emit('view-task', task)" />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
       <div v-if="filteredTasks.length === 0" class="flex align-items-center justify-content-center h-full text-center text-gray-500">
          <div>
              <i class="pi pi-search text-4xl mb-3"></i>
              <p class="text-xl">Задачи не найдены</p>
              <p>Попробуйте изменить поисковый запрос или сбросить фильтры.</p>
          </div>
      </div>
    </div>

    <Dialog header="Новая задача" v-model:visible="isCreateDialogVisible" modal :style="{width: '50vw'}" :breakpoints="{'960px': '75vw', '640px': '90vw'}">
      <CreateTask ref="createTaskForm" @task-created="onTaskCreated" />
      <template #footer>
        <Button label="Отмена" icon="pi pi-times" class="p-button-text" @click="isCreateDialogVisible = false" />
        <Button label="Создать" icon="pi pi-check" @click="submitCreateTask" />
      </template>
    </Dialog>
    
    <Dialog header="Загрузка файлов для задачи" v-model:visible="isUploadDialogVisible" modal :style="{width: '40vw'}">
        <div class="flex flex-column gap-4" v-if="selectedTaskForUpload">
            <p>Укажите недостающие данные для задачи <strong>"{{ selectedTaskForUpload.cardName }}"</strong>.</p>
            
            <div class="flex flex-column">
                <label class="font-semibold mb-2 text-gray-700">Файл отчета (.xls, .xlsx) <span v-if="xlsIsOptional">(необязательно)</span></label>
                <div @click="triggerFileInput('xlsUpdateInput')" class="flex align-items-center justify-content-center p-4 border-2 border-dashed border-gray-300 border-round-md cursor-pointer hover:border-blue-400" :class="{'border-blue-500': fileForUpdate}">
                    <input ref="xlsUpdateInput" type="file" @change="handleFileUpdateSelect" accept=".xls,.xlsx" class="hidden" />
                    <div class="text-center text-gray-500">
                        <i class="pi pi-upload text-3xl mb-2"></i>
                        <p v-if="!fileForUpdate">Выберите файл</p>
                        <p v-else class="text-blue-500 font-semibold">{{ fileForUpdate.name }}</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-column">
                <label class="font-semibold mb-2 text-gray-700">Путь к папке с видео</label>
                <InputText v-model="folderForUpdate" placeholder="Например: /Users/me/Videos/ProjectA" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Отмена" icon="pi pi-times" class="p-button-text" @click="isUploadDialogVisible = false" />
            <Button label="Загрузить и обновить" icon="pi pi-check" @click="submitUpdateTask" :disabled="!folderForUpdate || (!fileForUpdate && !xlsIsOptional)" />
        </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import CreateTask from './CreateTask.vue';
import { api } from '@/api.js';
import * as XLSX from 'xlsx';

const emit = defineEmits(['view-task']);

const tasks = ref([]);
const activeAccordionIndex = ref(null);
const isCreateDialogVisible = ref(false);
const isUploadDialogVisible = ref(false);
const createTaskForm = ref(null);
const searchQuery = ref('');
const statusFilter = ref(null);
const statusOptions = [
  { label: 'Все статусы', value: null },
  { label: 'Не начата', value: 'не начата' },
  { label: 'В процессе', value: 'в процессе' },
  { label: 'Завершена', value: 'завершена' },
];
const startingIds = ref([]);

// For Upload Dialog
const selectedTaskForUpload = ref(null);
const fileForUpdate = ref(null);
const folderForUpdate = ref('');
const xlsUpdateInput = ref(null);

const xlsIsOptional = computed(() => {
  const t = selectedTaskForUpload.value;
  if (!t) return false;
  return Boolean(t.parsedData) || Boolean(t.fileName);
});

function storageKey(taskId) {
  return `rv_task_parsed_${taskId}`;
}

function loadTaskStorage(taskId) {
  try {
    const raw = sessionStorage.getItem(storageKey(taskId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { parsedData: parsed };
    }
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveTaskStorage(taskId, partial) {
  try {
    const existing = loadTaskStorage(taskId);
    const merged = { ...existing, ...partial };
    sessionStorage.setItem(storageKey(taskId), JSON.stringify(merged));
  } catch (e) {
    // ignore storage errors
  }
}

onMounted(async () => {
  const orgs = await api.getOrganizations();
  if (orgs.length > 0) {
      const dayMaps = await api.getDayMaps(orgs[0].id);
      tasks.value = dayMaps.map(dm => {
        const saved = loadTaskStorage(dm.id);
        return {
          id: dm.id,
          cardName: dm.title,
          orgName: orgs[0].name,
          status: 'не начата',
          fileName: saved.fileName ?? null,
          folderName: saved.folderName ?? null,
          parsedData: saved.parsedData ?? null,
        };
      });
  }
});

const getStatusSeverity = (status) => {
  if (status === 'завершена') return 'success';
  if (status === 'в процессе') return 'warning';
  return 'info'; // не начата
};

const filteredTasks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return tasks.value.filter(t => {
    const matchesQuery = !q || [t.cardName, t.orgName, t.fileName]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(q));
    const matchesStatus = statusFilter.value ? t.status === statusFilter.value : true;
    return matchesQuery && matchesStatus;
  });
});

const submitCreateTask = async () => {
  const success = await createTaskForm.value.createTask();
  if (success) {
    isCreateDialogVisible.value = false;
  }
};

const onTaskCreated = (newTask) => {
  saveTaskStorage(newTask.id, {
    fileName: newTask.fileName || null,
    folderName: newTask.folderName || null,
    parsedData: newTask.parsedData || null,
  });
  tasks.value.unshift(newTask);
  activeAccordionIndex.value = 0; 
};

function isStarting(id) {
  return startingIds.value.includes(id);
}

async function startTask(task) {
  if (!task || !task.fileName || !task.folderName || task.status === 'в процессе') return;
  startingIds.value = [...startingIds.value, task.id];
  try {
    // const updated = await api.startTask(task.id);
    // const idx = tasks.value.findIndex(t => t.id === task.id);
    // if (idx !== -1) tasks.value[idx] = updated;
  } catch (e) {
    console.error('Не удалось запустить задачу', e);
  } finally {
    startingIds.value = startingIds.value.filter(id => id !== task.id);
  }
}

// --- Methods for Upload Dialog ---
function openUploadDialog(task) {
    selectedTaskForUpload.value = task;
    fileForUpdate.value = null;
    folderForUpdate.value = task.folderName || '';
    isUploadDialogVisible.value = true;
}

function triggerFileInput(refName) {
    if (refName === 'xlsUpdateInput' && xlsUpdateInput.value) xlsUpdateInput.value.click();
}

function handleFileUpdateSelect(event) {
    fileForUpdate.value = event.target.files[0];
}

async function submitUpdateTask() {
    if (!selectedTaskForUpload.value || !folderForUpdate.value) {
        return;
    }

    try {
        await api.scanVideos(selectedTaskForUpload.value.id, folderForUpdate.value);
        
        let parsedData = selectedTaskForUpload.value.parsedData || null;
        if (!xlsIsOptional.value) {
          parsedData = await parseXlsFile(fileForUpdate.value);
        } else if (fileForUpdate.value) {
          parsedData = await parseXlsFile(fileForUpdate.value);
        }

        const idx = tasks.value.findIndex(t => t.id === selectedTaskForUpload.value.id);
        if (idx !== -1) {
            tasks.value[idx].fileName = fileForUpdate.value ? fileForUpdate.value.name : tasks.value[idx].fileName;
            tasks.value[idx].folderName = folderForUpdate.value;
            tasks.value[idx].parsedData = parsedData;
            saveTaskStorage(tasks.value[idx].id, {
              fileName: tasks.value[idx].fileName,
              folderName: tasks.value[idx].folderName,
              parsedData: tasks.value[idx].parsedData,
            });
        }

        isUploadDialogVisible.value = false;
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
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
              if (normalizedNextRow.includes('время') || normalizedNextRow.includes('направление')) {
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

<style scoped>
::deep(.p-tag-warning) {
  background-color: #FB923C;
  color: #7C2D12;
}
</style>