<!--trainer level slug index-->
<script setup lang="ts">
const {$api} = useNuxtApp()
const {course_slug,level_slug} = useRoute().params
const {data:topics_data,pending:pending} = useHttpRequest(await useAsyncData(()=>$api.trainer.topics(level_slug)))
useSeoMeta({
  title: `${topics_data.value.level.name}`,
})
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
     { label: 'Тренажер', to: '/courses/trainer/' },
    { label: topics_data.course.name, to: `/courses/trainer/${course_slug}`  },
    { label: topics_data.level.name  },

  ]"
  />
  <BlockCourseHeader :title="topics_data.level.name" />
  <div class="grid grid-cols-3 gap-3">
    <NuxtLink v-for="topic in topics_data.topics"  :to="`/courses/trainer/${course_slug}/${level_slug}/${topic.slug}`"
              class="hidden sm:flex items-center gap-4 p-5 bg-white border border-[#18181b]/10 rounded-[20px]">
      {{topic.order_txt}}
      <div class="w-full flex flex-col gap-[3px]">

        <div class="font-medium text-sm leading-[130%] text-[#778]">{{topic.name}}</div>
        <p class="font-normal text-xs leading-[130%] text-[#8f8fa3]">{{topic.description}} </p>


      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>

</style>