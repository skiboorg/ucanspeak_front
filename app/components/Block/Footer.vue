<script setup lang="ts">
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
</script>

<template>
<footer class="block md:hidden">
  <div class="fixed bottom-0 w-full h-[100px] bg-white pt-3 flex items-center justify-evenly">
    <NuxtLink class="footer-link flex flex-col items-center justify-center gap-1" exact-active-class="active" active-class="active" to="/courses">
      <i class="text-[20px] pi pi-bookmark"></i>
      <p>Курсы</p>
    </NuxtLink>
    <NuxtLink class="footer-link flex flex-col items-center justify-center gap-1" exact-active-class="active" active-class="active" to="/courses/trainer">
      <i class="text-[20px] pi pi-book"></i>

      <p>Тренажёр</p>
    </NuxtLink>
    <NuxtLink v-if="user.last_lesson_url" :to="user.last_lesson_url" class="footer-link flex flex-col items-center justify-center gap-1" exact-active-class="active" active-class="active">
      <i class="text-[20px] pi pi-play-circle"></i>

      <p>Продолжить</p>
    </NuxtLink>
    <NuxtLink class="footer-link flex flex-col items-center justify-center gap-1" exact-active-class="active" active-class="active" to="/profile/favorite">
      <i class="text-[20px] pi pi-heart"></i>
      <p>Избранное</p>
    </NuxtLink>
    <NuxtLink class="footer-link flex flex-col items-center justify-center gap-1" exact-active-class="active" active-class="active" to="/profile">
      <i class="text-[20px] pi pi-user"></i>
      <p>Профиль</p>
    </NuxtLink>
  </div>
</footer>
</template>

<style lang="sass">
.footer-link
  color: #777788
  p
    font-size: 11px
  svg
    path
      fill: #8F8FA3
  &.active
    color: #3333E8
    svg
      path
        fill: #3333E8
</style>