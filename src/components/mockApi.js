import * as XLSX from 'xlsx';

/**
 * Этот файл имитирует ответы от бэкенд API.
 */

// --- НАЧАЛЬНЫЕ ДАННЫЕ ДЛЯ ЗАДАЧ ---
const mockTasks = [
  {
    id: 'task-1',
    status: 'завершена',
    cardName: 'ДО Центральный',
    orgName: 'Сбер',
    fileName: 'sber_report.xlsx',
    folderName: 'video_archive_1',
    parsedData: [
        { 'Отдел': 'Отдел А', 'ФИО': 'Иванов И.И.', 'Время': '09:05', 'Направление': 'вход' },
        { 'Отдел': 'Отдел А', 'ФИО': 'Иванов И.И.', 'Время': '18:02', 'Направление': 'выход' }
    ],
    createdAt: new Date('2025-09-23T10:00:00Z')
  },
  {
    id: 'task-2',
    status: 'в процессе',
    cardName: 'КИЦ Сочинский',
    orgName: 'ВТБ',
    fileName: 'vtb_analytics.xls',
    folderName: 'videos_vtb',
    parsedData: [
        { 'Отдел': 'Центральный офис', 'ФИО': 'Петров П.П.', 'Время': '08:58', 'Направление': 'вход' }
    ],
    createdAt: new Date('2025-09-24T11:30:00Z')
  },
];

export function mockCreateOrganization(orgData) {
  console.log('--- MOCK API: Создание организации ---', orgData);
  return new Promise(resolve => setTimeout(() => resolve({ id: `org-${Date.now()}`, ...orgData }), 300));
}

export function mockCreatePreset(orgId, presetData) {
    console.log(`--- MOCK API: Создание пресета для организации ${orgId} ---`, presetData);
    return new Promise(resolve => setTimeout(() => resolve({ id: `preset-${Date.now()}`, ...presetData }), 300));
}

export function mockCreateDayMap(orgId, dayMapData) {
    console.log(`--- MOCK API: Создание карты дня для организации ${orgId} ---`, dayMapData);
    return new Promise(resolve => setTimeout(() => resolve({ id: `dm-${Date.now()}`, ...dayMapData }), 300));
}

export function mockGetOrganizations() {
  console.log('--- MOCK API: Получение списка организаций ---');
  return new Promise((resolve) => {
    setTimeout(() => {
      const organizations = [
        { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Сбер', created_at: new Date().toISOString() },
        { id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', name: 'ВТБ', created_at: new Date().toISOString() },
      ];
      resolve(organizations);
    }, 500);
  });
}

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

export function mockGetTasks() {
  console.log('--- MOCK API: Получение списка задач ---');
  return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockTasks))), 300));
}

export function mockCreateTask(taskData) {
    console.log('--- MOCK API: Создание задачи ---', taskData);
    return new Promise(resolve => {
        setTimeout(() => {
            const newTask = { 
                ...taskData, 
                id: `task-${Date.now()}`, 
                status: 'не начата', 
                createdAt: new Date() 
            };
            mockTasks.unshift(newTask);
            resolve(newTask);
        }, 500);
    });
}

/**
 * NEW: Обновляет существующую задачу файлами.
 */
export async function mockUpdateTask(taskId, { file, folderName }) {
    console.log(`--- MOCK API: Обновление задачи ${taskId} файлами ---`);
    const idx = mockTasks.findIndex(t => t.id === taskId);
    if (idx === -1) {
        throw new Error('Задача не найдена');
    }

    // Парсим файл
    const parsedData = await mockUploadAndParseFile(taskId, file);

    // Обновляем задачу
    mockTasks[idx] = {
        ...mockTasks[idx],
        fileName: file.name,
        folderName: folderName,
        parsedData: parsedData
    };

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockTasks[idx])));
        }, 500);
    });
}


export function mockStartTask(taskId) {
  console.log('--- MOCK API: Запуск задачи ---', taskId);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const idx = mockTasks.findIndex(t => t.id === taskId);
        if (idx === -1) {
          return reject(new Error('Задача не найдена'));
        }
        if (!mockTasks[idx].fileName || !mockTasks[idx].folderName) {
            return reject(new Error('Не все файлы загружены для запуска задачи'));
        }
        mockTasks[idx].status = 'в процессе';
        resolve(JSON.parse(JSON.stringify(mockTasks[idx])));
    }, 1000);
  });
}

export const api = {
  createOrganization: mockCreateOrganization,
  createPreset: mockCreatePreset,
  createDayMap: mockCreateDayMap,
  getOrganizations: mockGetOrganizations,
  uploadAndParseFile: mockUploadAndParseFile,
  getTasks: mockGetTasks,
  createTask: mockCreateTask,
  updateTask: mockUpdateTask, // NEW
  startTask: mockStartTask,
};