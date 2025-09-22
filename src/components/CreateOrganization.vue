<template>
  <div class="flex align-items-center justify-content-center min-h-screen w-full bg-gray-100 p-4">
    <div class="surface-card border-round-2xl shadow-2 p-6 w-full max-w-30rem border-1 border-200">
      <!-- Заголовок и кнопка закрытия -->
      <div class="flex justify-content-between align-items-start mb-5">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-blue-400 m-0 mb-2">
            {{ currentStep === 'org' ? 'Создать организацию' : 'Добавить пресет' }}
          </h2>
          <p class="text-gray-500 text-sm m-0 line-height-3">
            {{ currentStep === 'org' ? 'Заполните основную информацию об организации' : 'Настройте параметры пресета' }}
          </p>
        </div>
        <button 
          class="p-2 border-none bg-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-50 border-circle cursor-pointer transition-colors transition-transform transition-duration-300"
          @click="handleBack"
          :disabled="isLoading"
        >
          <span class="pi pi-times text-xl"></span>
        </button>
      </div>

      <!-- Индикатор прогресса -->
      <div class="mb-5">
        <div class="flex align-items-center gap-3">
          <div class="flex flex-column align-items-center gap-2 flex-1">
            <div class="step-number flex align-items-center justify-content-center border-circle font-bold text-base mb-1"
                 :class="currentStep === 'org' ? 'bg-blue-400 text-white border-blue-400 scale-110' : currentStep === 'preset' ? 'bg-green-500 text-white border-green-500' : 'bg-gray-200 text-gray-500 border-gray-200'">
                 <i v-if="currentStep === 'preset'" class="pi pi-check"></i>
                 <span v-else>1</span>
            </div>
            <span class="step-label text-xs font-medium text-center"
                  :class="currentStep === 'org' || currentStep === 'preset' ? 'text-gray-900 font-semibold' : 'text-gray-400'">
              Организация
            </span>
          </div>
          <div class="flex-1 h-2 border-round-xl transition-colors transition-duration-300"
               :class="currentStep === 'preset' ? 'bg-blue-400' : 'bg-gray-200'">
          </div>
          <div class="flex flex-column align-items-center gap-2 flex-1">
            <div class="step-number flex align-items-center justify-content-center border-circle font-bold text-base mb-1"
                 :class="currentStep === 'preset' ? 'bg-blue-400 text-white border-blue-400 scale-110' : 'bg-gray-200 text-gray-500 border-gray-200'">
              2
            </div>
            <span class="step-label text-xs font-medium text-center"
                  :class="currentStep === 'preset' ? 'text-gray-900 font-semibold' : 'text-gray-400'">
              Пресет
            </span>
          </div>
        </div>
      </div>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="bg-red-100 border-1 border-red-400 text-red-700 p-3 border-round-lg text-sm mb-4">
        <strong>Ошибка:</strong> {{ error }}
      </div>

      <!-- Форма создания организации -->
      <div v-if="currentStep === 'org'" class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label class="flex align-items-center gap-1 text-sm font-semibold text-gray-700">
            <span>Название организации</span>
            <span class="required">*</span>
          </label>
          <div class="relative flex align-items-center">
            <span class="input-icon pi pi-building"></span>
            <input 
              v-model="orgName" 
              class="form-input w-full p-3 pl-6 border-1 border-300 border-round-xl outline-none text-lg focus:border-blue-400 transition-border transition-duration-300" 
              placeholder="Введите название организации"
              @keyup.enter="handleCreateOrg"
            />
          </div>
        </div>
        
        <div class="flex flex-column gap-2">
          <label class="text-sm font-semibold text-gray-700">Описание</label>
          <div class="relative flex align-items-center">
            <span class="input-icon pi pi-file-text"></span>
            <textarea 
              v-model="orgDesc" 
              class="form-input w-full p-3 pl- border-1 border-300 border-round-xl outline-none text-lg focus:border-blue-400 transition-border transition-duration-300 resize-vertical" 
              placeholder="Краткое описание организации (необязательно)"
              rows="4"
            ></textarea>
          </div>
        </div>

        <button 
          class="flex align-items-center justify-content-center gap-2 p-3 text-lg font-semibold border-none border-round-xl cursor-pointer transition-colors transition-transform transition-duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          :class="orgName.trim() ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-gray-200 text-gray-500'"
          :disabled="!orgName.trim() || isLoading" 
          @click="handleCreateOrg"
        >
          <span v-if="isLoading" class="pi pi-spin pi-spinner"></span>
          <span v-else class="pi pi-arrow-right"></span>
          {{ isLoading ? 'Создание...' : 'Продолжить' }}
        </button>
      </div>

      <!-- Форма создания пресета -->
      <div v-else-if="currentStep === 'preset'" class="flex flex-column gap-4">
        <div class="flex flex-column gap-2">
          <label class="flex align-items-center gap-1 text-sm font-semibold text-gray-700">
            <span>Название пресета</span>
            <span class="required">*</span>
          </label>
          <div class="relative flex align-items-center">
            <span class="input-icon pi pi-cog"></span>
            <input 
              v-model="presetName" 
              class="form-input w-full p-3 pl-6 border-1 border-300 border-round-xl outline-none text-lg focus:border-blue-400 transition-border transition-duration-300" 
              placeholder="Введите название пресета"
              @keyup.enter="handleCreatePreset"
            />
          </div>
        </div>
        
        <div class="flex flex-column gap-2">
          <label class="text-sm font-semibold text-gray-700">Описание</label>
          <div class="relative flex align-items-center">
            <span class="input-icon pi pi-file-text"></span>
            <textarea 
              v-model="presetDesc" 
              class="form-input w-full p-3 pl-3 border-1 border-300 border-round-xl outline-none text-lg focus:border-blue-400 transition-border transition-duration-300 resize-vertical" 
              placeholder="Настройки пресета (лица/люди)"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-2">
          <button 
            class="flex-1 flex align-items-center justify-content-center gap-2 p-3 text-lg font-semibold border-2 border-gray-200 border-round-xl cursor-pointer transition-colors transition-transform transition-duration-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
            @click="handleBackToOrg"
            :disabled="isLoading"
          >
            <span class="pi pi-arrow-left"></span>
            Назад
          </button>
          <button 
            class="flex-1 flex align-items-center justify-content-center gap-2 p-3 text-lg font-semibold border-none border-round-xl cursor-pointer transition-colors transition-transform transition-duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="presetName.trim() ? 'bg-blue-400 text-white hover:bg-blue-500' : 'bg-gray-200 text-gray-500'"
            :disabled="!presetName.trim() || isLoading" 
            @click="handleCreatePreset"
          >
            <span v-if="isLoading" class="pi pi-spin pi-spinner"></span>
            <span v-else class="pi pi-check"></span>
            {{ isLoading ? 'Создание...' : 'Создать' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockCreateOrganization, mockCreatePreset } from './mockApi.js' // Импортируем моковые функции

const emit = defineEmits(['back'])

// --- Переключатель режима API ---
// true: использовать фейковые данные из mockApi.js
// false: использовать реальные запросы fetch
const USE_MOCK_API = true;

// --- Состояние компонента ---
const currentStep = ref('org')
const orgName = ref('')
const orgDesc = ref('')
const presetName = ref('')
const presetDesc = ref('')

const createdOrgId = ref(null) // ID созданной организации
const isLoading = ref(false)   // Флаг загрузки
const error = ref(null)        // Сообщение об ошибке

// --- Методы ---

/**
 * Обработчик создания организации
 */
async function handleCreateOrg() {
  if (!orgName.value.trim() || isLoading.value) {
    return;
  }
  
  isLoading.value = true
  error.value = null

  try {
    let data;
    if (USE_MOCK_API) {
      // --- Логика для MOCK API ---
      data = await mockCreateOrganization({
        name: orgName.value,
        description: orgDesc.value,
      });
    } else {
      // --- Логика для реального API ---
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orgName.value,
          description: orgDesc.value,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      data = await response.json();
    }

    createdOrgId.value = data.id // Сохраняем ID для следующего шага
    currentStep.value = 'preset'

  } catch (e) {
    console.error('Ошибка при создании организации:', e)
    error.value = e.message || 'Произошла неизвестная ошибка.'
  } finally {
    isLoading.value = false
  }
}

/**
 * Обработчик создания пресета
 */
async function handleCreatePreset() {
  if (!presetName.value.trim() || !createdOrgId.value || isLoading.value) {
    return
  }

  isLoading.value = true
  error.value = null

  try {
    if (USE_MOCK_API) {
        // --- Логика для MOCK API ---
        await mockCreatePreset(createdOrgId.value, {
            name: presetName.value,
            description: presetDesc.value,
        });
    } else {
        // --- Логика для реального API ---
        const url = `/api/organizations/${createdOrgId.value}/camera-presets`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            name: presetName.value,
            description: presetDesc.value,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
    }

    // Успешное создание, можно закрыть форму
    console.log('Организация и пресет успешно созданы!')
    emit('back')

  } catch (e) {
    console.error('Ошибка при создании пресета:', e)
    error.value = e.message || 'Произошла неизвестная ошибка.'
  } finally {
    isLoading.value = false
  }
}

/**
 * Возврат к шагу создания организации
 */
function handleBackToOrg() {
  currentStep.value = 'org'
  error.value = null // Сбрасываем ошибку при возврате
}

/**
 * Закрытие формы
 */
function handleBack() {
  emit('back')
}
</script>

<style scoped>
.step-number {
  width: 48px;
  height: 48px;
  border-width: 3px;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}
.input-icon {
  position: absolute;
  left: 1.1rem;
  color: #9ca3af;
  font-size: 1.1rem;
  z-index: 1;
}
.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
.required {
  color: #ef4444;
  font-weight: 800;
  font-size: 1.1rem;
}
.resize-vertical {
    resize: vertical;
}
</style>

