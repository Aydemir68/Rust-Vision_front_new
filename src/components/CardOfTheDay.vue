<template>
    <div class="surface-card p-2 w-full">
      <div class="text-2xl font-bold text-blue-400 mb-4 text-center">Карточка дня</div>
      <div class="overflow-auto">
        <table class="w-full border-separate border-spacing-0">
          <thead>
            <tr class="bg-blue-50">
              <th v-for="col in columns" :key="col.key" class="p-3 text-center text-blue-500 font-semibold">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-blue-100">
              <td v-for="col in columns" :key="col.key" class="p-2 border-bottom-1 border-gray-200">
                <input
                  v-model="row[col.key]"
                  class="w-full p-3 border-round-md border-1 border-gray-300 focus:border-blue-400 outline-none text-gray-800 bg-transparent"
                  @input="onEdit(rowIndex, col.key, row[col.key])"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-content-center mt-4 gap-2">
        <button class="p-2 px-4 border-round-xl bg-blue-400 text-white font-bold border-none cursor-pointer hover:bg-blue-500" @click="addRow">+</button>
        <button class="p-2 px-4 border-round-xl bg-red-400 text-white font-bold border-none cursor-pointer hover:bg-red-500" @click="deleteRow">-</button>
        <button class="p-2 px-4 border-round-xl bg-gray-200 text-gray-700 font-bold border-none cursor-pointer hover:bg-gray-300" @click="$emit('close')">Закрыть</button>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { key: 'pkoName', label: 'Наименование ПКО' },
  { key: 'workerName', label: 'ID работника ПКО' },
  { key: 'entryTime', label: 't входа/t выхода' },
  //{ key: 'identifier', label: 'Номер идентификатора' },
  { key: 'direction', label: 'Направление вход/выход' },
  { key: 'operationType', label: 'Вид операции' },
  { key: 'operationContent', label: 'Содержание операции' },
  { key: 'permissionTime', label: 't Разрешения / t Сообщения о проведенной операции' },
  { key: 'legalityCheck', label: 'Проверка правомерности операций' },
  { key: 'totalPasses', label: 'Количество проходов всего' },
  { key: 'totalPasses2', label: 'Количество проходов всего' },
  //{key: 'Test', label: 'TestTest'}
]

const rows = ref([
  // Пример начальной строки
  {
    pkoName: '',
    workerName: '',
    entryTime: '',
    identifier: '',
    direction: '',
    operationType: '',
    operationContent: '',
    permissionTime: '',
    legalityCheck: '',
    totalPasses: '',
    totalPasses2: '',
  },
])

function addRow() {
  rows.value.push({
    pkoName: '',
    workerName: '',
    entryTime: '',
    identifier: '',
    direction: '',
    operationType: '',
    operationContent: '',
    permissionTime: '',
    legalityCheck: '',
    totalPasses: '',
    totalPasses2: '',
  })
}

function deleteRow() {
  if (rows.value.length > 1) {
    rows.value.pop()
  }
}

function onEdit(rowIndex, key, value) {

}
</script>