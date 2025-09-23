<template>
  <div :class="['organization-panel', { 'is-open': modelValue }]">
    <div class="p-4 h-full flex flex-column bg-gray-100">
      <div class="flex justify-content-between align-items-center mb-2">
        <h3 class="text-xl font-bold text-gray-800">Организации</h3>
        <button @click="$emit('update:modelValue', false)" class="p-2 border-none bg-transparent text-gray-500 hover:text-gray-800 border-circle cursor-pointer">
          <span class="pi pi-times"></span>
        </button>
      </div>

      <div v-if="loadingOrgs" class="text-center flex-1 flex align-items-center justify-content-center">
        <span class="pi pi-spin pi-spinner text-gray-500 text-3xl"></span>
      </div>
      <div v-else-if="orgError" class="text-red-500 bg-red-100 p-2 border-round-md">{{ orgError }}</div>
      <ul v-else class="list-none p-0 m-0 pt-3 flex flex-column gap-2 overflow-y-auto">
        <li v-for="org in organizations" :key="org.id">
          <div class="custom-hover border-round-2xl text-lg font-semibold text-center bg-transparent flex align-items-center gap-2 text-gray-500 hover:bg-blue-400 hover:text-blue-700 hover:shadow-2 cursor-pointer" @click="toggleOrg(org.id)">
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mockGetOrganizations, mockUploadAndParseFile } from './mockApi.js';

const USE_MOCK_API = true;

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'file-loaded', 'loading-start', 'loading-end']);

const organizations = ref([]);
const loadingOrgs = ref(true);
const orgError = ref(null);
const expandedOrg = ref(null);

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

  emit('loading-start');
  emit('update:modelValue', false);
  const dayMapId = 'mock-day-map-id';

  try {
    const parsedData = USE_MOCK_API
      ? await mockUploadAndParseFile(dayMapId, file)
      : await (async () => {
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch(`/api/v1/day-maps/${dayMapId}/entries`, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('Ошибка загрузки файла');
          return await response.json();
        })();

    const orgName = organizations.value.find(o => o.id === orgId)?.name || 'Неизвестная организация';

    emit('file-loaded', {
      parsedData,
      orgName,
      fileName: file.name,
    });

  } catch (error) {
    console.error("Ошибка при обработке файла:", error);
    alert(error.message);
    emit('file-loaded', { parsedData: [], orgName: '', fileName: '' });
  } finally {
    emit('loading-end');
    if (event.target) event.target.value = '';
  }
}
</script>

<style scoped>
.organization-panel {
  width: 0;
  min-width: 0;
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

.custom-hover {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
}
.custom-hover:hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: translateY(-5px);
}

.file-input {
  display: none;
}
</style>