<!--level_slug-->
<script setup lang="ts">
const completed  = ref(false)
const {level_slug}  = useRoute().params
const {$api} = useNuxtApp()
const {data:level,pending} = useHttpRequest(await useAsyncData(()=>$api.lessons.level(level_slug)))
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Курсы', to: '/courses' },
    { label: level.course.course_title },
  ]"
  />
  <BlockCourseHeader :title="level.course.course_title" :count="level.lessons.length" show_profile>
    <template #extra>
      <div @click="completed = !completed" class="flex items-center gap-4 justify-between cursor-pointer">
        <p class="select-none">Показывать только выполненные</p>
        <ToggleSwitch v-model="completed" />
      </div>

    </template>
  </BlockCourseHeader>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
    <CardLesson
        v-for="(lesson, i) in level.lessons"
        :key="i"
        :lesson="lesson"
    />
  </div>
</template>

<style scoped>

</style>