<script setup lang="ts">
const {$api} = useNuxtApp()
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
await $api.auth.me()
const {data:courses,pending} = useHttpRequest(await useAsyncData(()=>$api.lessons.courses()))
useSeoMeta({
  title: `Курсы `,
})
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Курсы' },
  ]"
  />
      <BlockCourseHeader title="Курсы" :count="courses?.length" show_profile>
        <template #extra>
          <NuxtLink v-if="user.last_lesson_url" :to="user.last_lesson_url" class="text-lg font-medium text-[#3333e8] hidden sm:flex items-center gap-3">

            <span>Продолжить с последнего места</span>
            <span class="flex items-center justify-center bg-[#3333e8]/10 w-9 h-9 rounded-[10px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.6 5.2C9.45143 5.08857 9.27477 5.02072 9.08981 5.00404C8.90484 4.98736 8.71889 5.02252 8.55279 5.10557C8.38668 5.18863 8.24698 5.31629 8.14935 5.47427C8.05171 5.63225 8 5.81429 8 6V18C8 18.1857 8.05171 18.3678 8.14935 18.5257C8.24698 18.6837 8.38668 18.8114 8.55279 18.8944C8.71889 18.9775 8.90484 19.0126 9.08981 18.996C9.27477 18.9793 9.45143 18.9114 9.6 18.8L17.6 12.8C17.7242 12.7069 17.825 12.5861 17.8944 12.4472C17.9639 12.3084 18 12.1552 18 12C18 11.8448 17.9639 11.6916 17.8944 11.5528C17.825 11.4139 17.7242 11.2931 17.6 11.2L9.6 5.2Z" fill="#3333E8" />
                    </svg>
                </span>
          </NuxtLink>
        </template>
      </BlockCourseHeader>
      <div class="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
        <div class="flex sm:hidden flex-col justify-between border border-[#18181B]/[0.05] rounded-2xl p-4 bg-white">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.001 6.03608C14.4488 4.64418 12.4145 3.91325 10.3313 3.99896C8.24816 4.08466 6.28077 4.98022 4.8481 6.49492C3.41544 8.00962 2.6307 10.0238 2.661 12.1085C2.69131 14.1932 3.53426 16.1837 5.01035 17.6561L14.1157 26.7601C14.6158 27.26 15.2939 27.5408 16.001 27.5408C16.7081 27.5408 17.3863 27.26 17.8863 26.7601L26.9917 17.6561C28.4678 16.1837 29.3107 14.1932 29.341 12.1085C29.3713 10.0238 28.5866 8.00962 27.1539 6.49492C25.7213 4.98022 23.7539 4.08466 21.6707 3.99896C19.5876 3.91325 17.5533 4.64418 16.001 6.03608ZM14.4383 8.22808L15.0583 8.84675C15.3084 9.09671 15.6475 9.23713 16.001 9.23713C16.3546 9.23713 16.6936 9.09671 16.9437 8.84675L17.5637 8.22808C18.0557 7.7187 18.6442 7.31239 19.2949 7.03288C19.9455 6.75336 20.6454 6.60623 21.3535 6.60008C22.0617 6.59393 22.764 6.72887 23.4194 6.99703C24.0749 7.2652 24.6704 7.66122 25.1711 8.16198C25.6719 8.66274 26.0679 9.25821 26.3361 9.91366C26.6042 10.5691 26.7392 11.2714 26.733 11.9796C26.7269 12.6877 26.5797 13.3876 26.3002 14.0382C26.0207 14.6889 25.6144 15.2774 25.105 15.7694L16.001 24.8748L6.89701 15.7694C5.9255 14.7635 5.38793 13.4163 5.40009 12.0179C5.41224 10.6196 5.97314 9.28189 6.96198 8.29305C7.95082 7.30421 9.28849 6.74331 10.6869 6.73116C12.0853 6.719 13.4325 7.25657 14.4383 8.22808Z" fill="#8F8FA3" />
          </svg>
          <h3 class="text-base leading-[120%] text-black">Выберите подходящий для себя курс!</h3>
        </div>

        <CardCourse v-for="course in courses" :key="course.id" :course="course" />
        <CardTrainer/>
      </div>

</template>