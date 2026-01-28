<script setup lang="ts">
const {level_slug, course_slug}  = useRoute().params
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
const showNotAuthModal = useState('showNotAuthModal')
interface Lesson {
  id: number
  title: string
  slug: string
  progress: number
  text: string
  completed: boolean
  pin: boolean
}

interface Props {
  lesson: Lesson
}

const props = defineProps<Props>()

const gotoLesson = () => {
  if (user.value){
    navigateTo(`/courses/${course_slug}/${level_slug}/${props.lesson.slug}`)
    return
  }


  if (props.lesson.is_free) {
    navigateTo(`/courses/${course_slug}/${level_slug}/${props.lesson.slug}`)
    return
  }

  showNotAuthModal.value = true

}
</script>

<template>
  <div @click="gotoLesson"
       class="bg-white border border-solid border-[rgba(24,24,27,0.1)] rounded-2xl p-4 flex flex-col gap-2 cursor-pointer">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
<!--        <img v-if="data.pin" src="~/assets/images/pin-icon.svg" alt="" class="shrink-0">-->
        <h3 class="font-medium text-lg leading-[130%] text-black">{{ lesson.title }}</h3>

      </div>

      <img v-if="lesson.completed" src="~/assets/images/check-circle.svg" alt="" class="shrink-0">
    </div>
    <p class="font-normal text-xs leading-[130%] text-[#8f8fa3]">{{lesson.short_description}} </p>
    <div class="flex flex-col gap-1">
      <p class="font-normal text-sm leading-[120%] text-[#8f8fa3]">{{ lesson.text }}</p>
      <UIPLine v-if="user && !user.is_pupil" :value="lesson.progress"/>
    </div>
  </div>
</template>