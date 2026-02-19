<script setup lang="ts">
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)

const links = [
  {title:'Профиль', to:'/profile'},
  {title:'Избранное', to:'/profile/favorite'},
  {title:'Прогресс', to:'/profile/progress'},
]

if (user.value.is_school){
  links.push(
      {title:'Ученики', to:'/profile/pupils'},
  )
}
</script>

<template>
  <BlockHeader/>

  <div class="container pt-20">
    <BlockBaseBreadcrumbs
        :items="[
    { label: 'Главная', to: '/' },
    { label: 'Профиль'},

  ]"/>
    <BlockCourseHeader title="Профиль" prev_link="/"/>
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12 md:col-span-3">
        <CardBase padding="sm" class="sticky top-5 space-y-2">
          <nuxt-link
              v-for="(link, i) in links"
              :key="i"
              :to="link.to"
              exact-active-class="bg-[#efeff5]"
              active-class="bg-[#efeff5]"
              class="w-full cursor-pointer flex items-center justify-between gap-2 p-4 rounded-2xl hover:bg-[#efeff5] transition-[0.2s] duration-[ease-in-out] ease-[all]"

          >
            <span> {{ i + 1 }}. {{ link.title }}</span>

          </nuxt-link>
        </CardBase>
      </div>
      <div class="col-span-12 md:col-span-9">
        <slot/>
      </div>
    </div>

  </div>

</template>
