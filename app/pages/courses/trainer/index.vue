<!--trainer index-->
<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:trainer,pending:pending} = useHttpRequest(await useAsyncData(()=>$api.trainer.courses()))
useSeoMeta({
  title: `Тренажер`,
})
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Тренажер' },
  ]"
  />
  <BlockCourseHeader title="Тренажер" >

  </BlockCourseHeader>
  <div class="flex flex-col gap-3">

    <NuxtLink v-for="course in trainer"  :to="`/courses/trainer/${course.slug}`" class="flex items-start gap-4 p-5 bg-white border border-[#18181b]/10 rounded-[20px]">
      <div class="shrink-0 w-16 h-16 flex items-center justify-center rounded-[10px]  border border-[18181b]/[0.5]">
        <img :src="course.icon" alt="" class="">
      </div>
      <div class="w-full flex flex-col gap-[3px]">

        <div class="font-bold text-lg leading-[130%] text-[#2c2c2c] uppercase">{{course.name}}</div>
        <p class="font-medium text-sm leading-[130%] text-[#778]">{{course.description}} </p>
        <UIPLine :value="0" class="my-[5px]"/>
        <p class="font-normal text-xs leading-[130%] text-[#8f8fa3]">0 из 0 уроков пройдено</p>

      </div>
    </NuxtLink>
  </div>
</template>