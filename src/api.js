import axios from 'axios';

/**
 * Этот файл содержит функции для взаимодействия с реальным бэкенд API, используя axios.
 */

const API_BASE_URL = 'http://192.168.8.115:9876/api/v1';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Получает список всех организаций.
 * @returns {Promise<Array>} - Массив организаций.
 */
export async function getOrganizations() {
  try {
    const response = await apiClient.get('/organizations');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Ошибка при получении организаций:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Создает новую организацию.
 * @param {object} orgData - Данные для создания организации (например, { name: 'New Org' }).
 * @returns {Promise<object>} - Созданный объект организации.
 */
export async function createOrganization(orgData) {
  try {
    const response = await apiClient.post('/organizations', orgData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Ошибка при создании организации:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Создает новый пресет для камеры для ПЕРВОЙ организации в списке.
 * @param {string} presetName - Имя пресета (будет использовано как camera_name).
 * @returns {Promise<{newPreset: object, organizationId: string}>} - Объект с созданным пресетом и ID организации.
 */
export async function createCameraPreset(presetName) {
  try {
    // 1. Получаем список организаций, чтобы найти ID первой
    const organizations = await getOrganizations();
    if (!organizations || organizations.length === 0) {
        throw new Error("Не найдено ни одной организации для создания пресета.");
    }
    const firstOrganization = organizations[0];
    const organizationId = firstOrganization.id;

    // 2. Формируем тело запроса строго по документации
    const payload = {
      camera_name: presetName,
      location: "Default Location",
      detectors: ["face", "person"],
      regions: {}
    };

    console.log(`Создание пресета для организации ${organizationId} с данными:`, payload);

    // 3. Отправляем запрос на создание
    const response = await apiClient.post(`/organizations/${organizationId}/camera-presets`, payload);
    
    // 4. Возвращаем созданный пресет И ID организации для последующей проверки
    return { newPreset: response.data, organizationId };

  } catch (error) {
    const errorMessage = error.response?.data?.message || "Неизвестная ошибка при создании пресета";
    const errorDetails = error.response?.data;
    console.error('Ошибка при создании пресета:', errorMessage, errorDetails ? JSON.stringify(errorDetails) : '');
    throw new Error(errorMessage);
  }
}

/**
 * Получает список всех пресетов для указанной организации.
 * @param {string} organizationId - ID организации.
 * @returns {Promise<Array>} - Массив пресетов.
 */
export async function getCameraPresets(organizationId) {
    try {
        const response = await apiClient.get(`/organizations/${organizationId}/camera-presets`);
        
        // ИЗМЕНЕНО: Добавляем подробный вывод в консоль
        console.log(`--- НАЧАЛО ДАННЫХ GET-ЗАПРОСА /camera-presets ---`);
        console.log(`URL: /organizations/${organizationId}/camera-presets`);
        console.log('Статус ответа:', response.status);
        console.log('Полученные данные:', JSON.stringify(response.data, null, 2));
        console.log(`--- КОНЕЦ ДАННЫХ GET-ЗАПРОСА ---`);

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Не удалось получить список пресетов";
        console.error('Ошибка при получении пресетов:', errorMessage);
        throw new Error(errorMessage);
    }
}

/**
 * Создает новую карту дня (задачу).
 * @param {string} orgId - ID организации.
 * @param {object} dayMapData - Данные для создания карты дня (например, { title: 'New Task' }).
 * @returns {Promise<object>} - Созданный объект карты дня.
 */
export async function createDayMap(orgId, dayMapData) {
  try {
    const response = await apiClient.post(`/organizations/${orgId}/day-maps`, dayMapData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Ошибка при создании карты дня:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Получает список всех карт дня (задач) для организации.
 * @param {string} orgId - ID организации.
 * @returns {Promise<Array>} - Массив карт дня.
 */
export async function getDayMaps(orgId) {
  try {
    const response = await apiClient.get(`/organizations/${orgId}/day-maps`);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Ошибка при получении карт дня:', errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * Отправляет путь к папке с видео для сканирования.
 * @param {string} dayMapId - ID карты дня.
 * @param {string} path - Путь к папке с видео.
 * @returns {Promise<object>} - Результат сканирования.
 */
export async function scanVideos(dayMapId, path) {
  try {
    const response = await apiClient.post(`/day-maps/${dayMapId}/scan-videos`, { root_path: path, recursive: true });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('Ошибка при сканировании видео:', errorMessage);
    throw new Error(errorMessage);
  }
}

// Экспортируем все функции в одном объекте для удобства импорта
export const api = {
  getOrganizations,
  createOrganization,
  createCameraPreset,
  getCameraPresets,
  createDayMap,
  getDayMaps,
  scanVideos,
};