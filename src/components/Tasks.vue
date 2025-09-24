<template>
  <div class="flex flex-column h-full w-full p-4 bg-gray-50">
    <div class="flex flex-column gap-3 mb-4">
      <div class="flex justify-content-between align-items-center">
        <h1 class="text-3xl font-bold text-gray-700 m-0">Задачи</h1>
        <Button label="Создать задачу" icon="pi pi-plus" class="bg-blue-500 border-0 border-round-xl hover:bg-blue-600" @click="isDialogVisible = true" />
      </div>

      <div class="flex gap-3 flex-wrap justify-content-betweenalign-items-center  ">
        <div class="flex-1 min-w-12rem " style="max-width: 420px;">
          <span class="flex w-full justify-content-between gap-2 ">
            <InputText v-model="searchQuery" placeholder="Поиск по названию, организации или файлу" class="w-full" />
          </span>
        </div>
        <Dropdown class="w-12rem" v-model="statusFilter" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Статус" />
      </div>
    </div>

    <div class="flex-grow-1 overflow-auto">
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
                <span>{{ task.fileName }}</span>
              </div>
              <div v-if="task.folderName" class="col-12 md:col-6 lg:col-4 flex align-items-center gap-2">
                <i class="pi pi-folder-open text-yellow-500"></i>
                <span class="font-semibold">Папка с видео:</span>
                <span>{{ task.folderName }}</span>
              </div>
            </div>
            <Divider />
            <div class="flex justify-content-end gap-2">
              <Button 
                label="Запустить" 
                icon="pi pi-play" 
                class="bg-green-400 border-0 hover:bg-green-500"
                :disabled="task.status === 'в процессе' || isStarting(task.id)"
                :loading="isStarting(task.id)"
                @click="startTask(task)"
              />
              <Button label="Открыть карту дня" icon="pi pi-arrow-right" class="bg-blue-500 border-0 hover:bg-blue-600" @click="$emit('view-task', task)" />
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

    <Dialog header="Новая задача" v-model:visible="isDialogVisible" modal :style="{width: '50vw'}" :breakpoints="{'960px': '75vw', '640px': '90vw'}">
      <CreateTask ref="createTaskForm" @task-created="onTaskCreated" />
      <template #footer>
        <Button label="Отмена" icon="pi pi-times" class="p-button-text" @click="isDialogVisible = false" />
        <Button label="Создать" icon="pi pi-check" @click="submitCreateTask" />
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
import { api } from './mockApi.js';

const emit = defineEmits(['view-task']);

const tasks = ref([]);
const activeAccordionIndex = ref(null);
const isDialogVisible = ref(false);
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

onMounted(async () => {
  tasks.value = await api.getTasks();
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
    isDialogVisible.value = false;
  }
};

const onTaskCreated = (newTask) => {
  tasks.value.unshift(newTask);
  activeAccordionIndex.value = 0; // Открываем новую задачу
};

function isStarting(id) {
  return startingIds.value.includes(id);
}

async function startTask(task) {
  if (!task || task.status === 'в процессе') return;
  startingIds.value = [...startingIds.value, task.id];
  try {
    const updated = await api.startTask(task.id);
    const idx = tasks.value.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      tasks.value[idx] = updated;
    }
  } catch (e) {
    console.error('Не удалось запустить задачу', e);
  } finally {
    startingIds.value = startingIds.value.filter(id => id !== task.id);
  }
}
</script>

<style scoped>
/* Стиль для оранжевого тега, если тема по умолчанию дает желтый */
:deep(.p-tag-warning) {
  background-color: #FB923C; /* orange-400 */
  color: #7C2D12; /* orange-900 */
}
</style>