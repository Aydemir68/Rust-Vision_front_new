/**
 * Этот файл имитирует ответы от бэкенд API.
 * Используйте его для разработки и тестирования фронтенда без необходимости запускать сервер.
 */

/**
 * Имитирует создание организации.
 * @param {object} orgData - Данные организации { name, description }.
 * @returns {Promise<object>} - Промис, который разрешается с объектом организации или отклоняется с ошибкой.
 */
export function mockCreateOrganization(orgData) {
  console.log('--- MOCK API: Создание организации ---', orgData);
  
  return new Promise((resolve, reject) => {
    // Имитируем задержку сети (1 секунда)
    setTimeout(() => {
      // Имитируем валидацию на сервере
      if (orgData.name.toLowerCase().includes('error')) {
        console.error('--- MOCK API: Ошибка валидации организации ---');
        reject(new Error('Имя "error" недопустимо. (Моковая ошибка)'));
        return;
      }
      
      const newOrg = {
        id: crypto.randomUUID(), // Генерируем случайный ID
        name: orgData.name,
        description: orgData.description,
        created_at: new Date().toISOString(),
      };
      
      console.log('--- MOCK API: Организация успешно создана ---', newOrg);
      resolve(newOrg);
    }, 1000);
  });
}

/**
 * Имитирует создание пресета для камеры.
 * @param {string} orgId - ID организации.
 * @param {object} presetData - Данные пресета { name, description }.
 * @returns {Promise<object>} - Промис, который разрешается с объектом пресета или отклоняется с ошибкой.
 */
export function mockCreatePreset(orgId, presetData) {
  console.log(`--- MOCK API: Создание пресета для организации ${orgId} ---`, presetData);
  
  return new Promise((resolve, reject) => {
    // Имитируем задержку сети (1.5 секунды)
    setTimeout(() => {
      if (!orgId) {
        console.error('--- MOCK API: ID организации не предоставлен ---');
        reject(new Error('ID организации обязателен. (Моковая ошибка)'));
        return;
      }

      // Имитируем ошибку, если в названии есть слово "fail"
      if (presetData.name.toLowerCase().includes('fail')) {
        console.error('--- MOCK API: Ошибка создания пресета ---');
        reject(new Error('Не удалось создать пресет. Попробуйте снова. (Моковая ошибка)'));
        return;
      }

      const newPreset = {
        id: crypto.randomUUID(),
        name: presetData.name,
        description: presetData.description,
        // ... другие поля пресета
      };
      
      console.log('--- MOCK API: Пресет успешно создан ---', newPreset);
      resolve({ success: true, data: newPreset });
    }, 1500);
  });
}

