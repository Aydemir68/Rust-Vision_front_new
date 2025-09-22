import * as XLSX from 'xlsx';

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

/**
 * Имитирует создание "карты дня".
 * @param {string} orgId - ID организации.
 * @param {object} dayMapData - Данные карты дня { title, description }.
 * @returns {Promise<object>} - Промис, который разрешается с объектом карты дня или отклоняется с ошибкой.
 */
export function mockCreateDayMap(orgId, dayMapData) {
  console.log(`--- MOCK API: Создание карты дня для организации ${orgId} ---`, dayMapData);

  return new Promise((resolve, reject) => {
    // Имитируем задержку сети (1 секунда)
    setTimeout(() => {
      // Имитируем валидацию на сервере
      if (!orgId) {
        console.error('--- MOCK API: ID организации не предоставлен ---');
        reject(new Error('ID организации обязателен. (Моковая ошибка)'));
        return;
      }
      if (dayMapData.title.toLowerCase().includes('error')) {
        console.error('--- MOCK API: Ошибка валидации карты дня ---');
        reject(new Error('Название "error" недопустимо. (Моковая ошибка)'));
        return;
      }

      const newDayMap = {
        id: crypto.randomUUID(),
        organization_id: orgId,
        title: dayMapData.title,
        description: dayMapData.description,
        created_at: new Date().toISOString(),
      };

      console.log('--- MOCK API: Карта дня успешно создана ---', newDayMap);
      resolve(newDayMap);
    }, 1000);
  });
}

/**
 * Имитирует получение списка организаций.
 * @returns {Promise<Array<object>>} - Промис, который разрешается с массивом организаций.
 */
export function mockGetOrganizations() {
  console.log('--- MOCK API: Получение списка организаций ---');
  return new Promise((resolve) => {
    setTimeout(() => {
      const organizations = [
        { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Сбер', created_at: new Date().toISOString() },
        { id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', name: 'ВТБ', created_at: new Date().toISOString() },
        { id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', name: 'Альфа-Банк', created_at: new Date().toISOString() },
      ];
      console.log('--- MOCK API: Организации получены ---', organizations);
      resolve(organizations);
    }, 500);
  });
}

/**
 * Имитирует загрузку и парсинг XLSX файла.
 * @param {string} dayMapId - ID карты дня.
 * @param {File} file - Загружаемый файл.
 * @returns {Promise<Array<object>>} - Промис, который разрешается с массивом объектов-строк из файла.
 */
export function mockUploadAndParseFile(dayMapId, file) {
  console.log(`--- MOCK API: Парсинг файла "${file.name}" для карты дня ${dayMapId} ---`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Преобразуем лист в массив JSON-объектов
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error("Файл пуст или содержит только заголовки.");
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1).map(row => {
            const rowData = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            // Добавляем моковые id для соответствия структуре API
            rowData.id = crypto.randomUUID();
            rowData.day_map_id = dayMapId;
            return rowData;
        });

        console.log('--- MOCK API: Файл успешно распарсен ---', rows);
        resolve(rows);

      } catch (err) {
        console.error('--- MOCK API: Ошибка парсинга файла ---', err);
        reject(new Error('Не удалось прочитать данные из файла. (Моковая ошибка)'));
      }
    };

    reader.onerror = (err) => {
      console.error('--- MOCK API: Ошибка чтения файла ---', err);
      reject(new Error('Произошла ошибка при чтении файла.'));
    };

    reader.readAsBinaryString(file);
  });
}