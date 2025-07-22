<template>
  <aside class="top-0 right-0 surface-200 shadow-2 w-16rem flex flex-column p-4 top-0 right-0 h-screen">
    <div class="mb-6 text-center font-bold text-3xl text-blue-400">RustAnalytics</div>
    <ul class="list-none p-0 m-0 flex flex-column gap-4">
      <li class="custom-hover  cursor-pointer px-3 py-2 bg-white border-round-md
      hover:bg-blue-400 text-lg hover:text-white hover:shadow-2">1</li>
      <li class="custom-hover  cursor-pointer px-3 py-2 bg-white border-round-md
      hover:bg-blue-400 text-lg hover:text-white hover:shadow-2">2</li>
      <li class="custom-hover  cursor-pointer px-3 py-2 bg-white border-round-md
      hover:bg-blue-400 text-lg hover:text-white hover:shadow-2">3</li>
    </ul>
  </aside>
</template>

<script setup>
</script>

<style scoped>
.custom-hover {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-hover:hover {
  /*opacity: 0.65;*/
  transform: translateY(-5px);
}

</style> 