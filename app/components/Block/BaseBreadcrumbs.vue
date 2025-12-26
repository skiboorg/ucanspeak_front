<template>

  <nav class="flex items-center text-sm font-normal text-gray-500">
    <ol class="flex flex-wrap items-center gap-2">
      <li
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center gap-2"
      >
        <!-- ссылка -->
        <NuxtLink
            v-if="item.to && index !== items.length - 1"
            :to="item.to"
            class="hover:text-gray-900 transition"
        >
          {{ item.label }}
        </NuxtLink>

        <!-- текущая страница -->
        <span
            v-else
            class="text-gray-900 font-medium"
        >
          {{ item.label }}
        </span>

        <!-- разделитель -->
        <span
            v-if="index !== items.length - 1"
            class="text-gray-400"
        >
          /
        </span>
      </li>
    </ol>
  </nav>

</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label: 'Главная', to: '/' }]
  }
})
</script>
