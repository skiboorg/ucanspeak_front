<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:trainer,pending:pending} = useHttpRequest(await useAsyncData(()=>$api.trainer.courses()))
</script>

<template>

  <div class="flex flex-col gap-3">
    <div class="h-[241px] sm:h-[340px] lg:h-[300px] w-full rounded-2xl overflow-hidden relative z-[1] flex items-end border border-solid border-[rgba(24,24,27,0.05)]">
      <img src="~/assets/images/course-card-1.png" alt="" class="absolute z-[-1] left-0 top-0 w-full h-full object-cover">
      <div class="w-full backdrop-blur-sm bg-gr p-3 pt-[5px] sm:pt-5 sm:px-6 sm:pb-6 text-base sm:text-[28px] font-semibold leading-[130%] text-white">
        Разговорный тренажер

        <nuxt-link :to="`/courses/`" class="flex sm:hidden items-center justify-center w-full h-9 gap-1 bg-white text-sm text-[#3333E8] rounded-lg mt-2">
          <span>Перейти</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.22149 3.6261C5.06365 3.42751 4.98719 3.17635 5.00759 2.92349C5.02799 2.67064 5.14372 2.43499 5.33135 2.26426C5.51899 2.09354 5.76449 2.0005 6.01814 2.004C6.27179 2.0075 6.51464 2.10727 6.69749 2.2831L6.78249 2.3761L10.7825 7.3761C10.9108 7.53659 10.9865 7.73269 10.9994 7.93774C11.0122 8.14278 10.9617 8.34682 10.8545 8.5221L10.7825 8.6261L6.78249 13.6261C6.62382 13.8255 6.39502 13.9568 6.14282 13.9932C5.89061 14.0296 5.63403 13.9683 5.42547 13.8219C5.2169 13.6755 5.0721 13.455 5.02062 13.2054C4.96914 12.9559 5.01488 12.6961 5.14849 12.4791L5.22049 12.3761L8.72149 8.0011L5.22149 3.6261Z" fill="#3333E8" />
          </svg>
        </nuxt-link>
      </div>
    </div>
    <NuxtLink v-for="course in trainer"  :to="`/courses/trainer/${course.slug}`" class="hidden sm:flex items-start gap-4 p-5 bg-white border border-[#18181b]/10 rounded-[20px]">
      <div class="shrink-0 w-16 h-16 flex items-center justify-center rounded-[10px] bg-[#ffe5f7] border border-[18181b]/[0.5]">
        <img :src="course.icon" alt="" class="mix-blend-luminosity">
      </div>
      <div class="w-full flex flex-col gap-[3px]">

        <div class="font-medium text-sm leading-[130%] text-[#778]">{{course.name}}</div>
        <p class="font-normal text-xs leading-[130%] text-[#8f8fa3]">{{course.description}} </p>


      </div>
    </NuxtLink>
  </div>
</template>