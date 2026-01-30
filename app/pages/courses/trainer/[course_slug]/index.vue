<!--trainer course slug index-->
<script setup lang="ts">
const {$api} = useNuxtApp()
const {course_slug} = useRoute().params
const {data:levels_data,pending:pending} = useHttpRequest(await useAsyncData(()=>$api.trainer.course(course_slug)))
useSeoMeta({
  title: `${levels_data.value.course?.name}`,
})
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Тренажер', to: '/courses/trainer/' },
    { label: levels_data.course.name  },

  ]"
  />

  <BlockCourseHeader :title="levels_data.course.name" />
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    <NuxtLink v-for="level in levels_data.levels"  :to="`/courses/trainer/${course_slug}/${level.slug}`"
              class="flex  items-center gap-4 p-5 bg-white border border-[#18181b]/10 rounded-[20px]">
      <div class="shrink-0 w-16 h-16 flex items-center justify-center rounded-[10px]  border border-[18181b]/[0.5]">
        <img :src="level.icon" alt="" class="">
      </div>
      <div class="w-full flex flex-col gap-[3px]">

        <div class="font-medium text-sm leading-[130%] text-[#778]">{{level.name}}</div>
        <p class="font-normal text-xs leading-[130%] text-[#8f8fa3]">{{level.description}} </p>


      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>