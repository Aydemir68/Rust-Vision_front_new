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
 * Имитирует загрузку и парсинг XLSX файла с интеллектуальным определением заголовков.
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
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Конвертируем лист в массив массивов для анализа
          const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          if (!jsonDataRaw || jsonDataRaw.length === 0) {
            throw new Error("Файл пуст или не содержит данных.");
          }

          // --- Автоопределение строк заголовков ---
          let headerRowIndex = -1;
          let subHeaderRowIndex = -1;

          // Ищем основную строку заголовка (например, ту, что содержит "ФИО")
          for (let i = 0; i < Math.min(10, jsonDataRaw.length); i++) {
              const row = jsonDataRaw[i] || [];
              const normalizedRow = row.map(cell => String(cell).toLowerCase().trim());
              if (normalizedRow.includes('фио') || normalizedRow.includes('отдел')) {
                  headerRowIndex = i;
                  break;
              }
          }
          if (headerRowIndex === -1) throw new Error("Не удалось найти основную строку с заголовками (ожидались 'ФИО' или 'Отдел').");
          
          // Ищем строку с подзаголовками (например, "время", "направление")
          if (jsonDataRaw.length > headerRowIndex + 1) {
              const nextRow = jsonDataRaw[headerRowIndex + 1] || [];
              const normalizedNextRow = nextRow.map(cell => String(cell).toLowerCase().trim());
              if (normalizedNextRow.includes('время') || normalizedNextRow.includes('направление')) {
                  subHeaderRowIndex = headerRowIndex + 1;
              }
          }

          const mainHeaders = [...jsonDataRaw[headerRowIndex]]; // Создаем копию
          
          // **Ключевое исправление**: "Протягиваем" значение объединенной ячейки вправо
          for (let i = 1; i < mainHeaders.length; i++) {
              if (mainHeaders[i] === '' && mainHeaders[i-1] !== '') {
                  mainHeaders[i] = mainHeaders[i-1];
              }
          }

          const subHeaders = subHeaderRowIndex !== -1 ? jsonDataRaw[subHeaderRowIndex] : [];
          const dataStartIndex = subHeaderRowIndex !== -1 ? subHeaderRowIndex + 1 : headerRowIndex + 1;

          // "Склеиваем" заголовки, если есть вложенность
          const finalHeaders = mainHeaders.map((header, index) => {
              const mainHeader = String(header).trim();
              const subHeader = String(subHeaders[index] || '').trim();
              // Если основной заголовок содержит "Событие", используем подзаголовок
              if (mainHeader.toLowerCase().includes('событие') && subHeader) {
                  return subHeader;
              }
              return mainHeader;
          });

          const dataRows = jsonDataRaw.slice(dataStartIndex);

          const finalData = dataRows.map(row => {
              const rowObject = {};
              finalHeaders.forEach((header, index) => {
                  if (header) { // Только непустые заголовки
                      rowObject[header] = row[index];
                  }
              });
              return rowObject;
          }).filter(obj => Object.values(obj).some(val => val !== '' && val !== null && val !== undefined)); // Убираем пустые строки

          console.log('--- MOCK API: Файл успешно распарсен ---', finalData);
          resolve(finalData);
  
        } catch (err) {
          console.error('--- MOCK API: Ошибка парсинга файла ---', err);
          reject(new Error(err.message || 'Не удалось прочитать данные из файла.'));
        }
      };
  
      reader.onerror = (err) => {
        console.error('--- MOCK API: Ошибка чтения файла ---', err);
        reject(new Error('Произошла ошибка при чтении файла.'));
      };
  
      reader.readAsBinaryString(file);
    });
}