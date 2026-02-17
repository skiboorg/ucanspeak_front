<!--trainer topic index-->
<script setup lang="ts">

type ViewMode =  "audio" | "trainer"
const {$api} = useNuxtApp()
const {course_slug,level_slug,topic_slug} = useRoute().params
const {data:topic_data,pending,refresh} = useHttpRequest(await useAsyncData(()=>$api.trainer.topic(topic_slug)))

const show_test = ref(false)
const loading = ref(false)
const is_play = ref(false)
const show_player = ref(false)
const current_audio = ref()

onMounted(()=>{
  current_audio.value = topic_data.value.topic.audio_files[0]
})

const openAudio = (file) =>{
  current_audio.value = file
  show_test.value = false

}
const openAudioMobile = (file) =>{
  current_audio.value = file
  show_test.value = false
  is_play.value = true
  show_player.value = true
}

const stopAudioMobile = () =>{
  is_play.value = false
  show_player.value = false
}

const handleToggleFav = async (id) => {
  console.log('sdf',id)
  await $api.trainer.toggle_trainer_favorite({
    id: id
  })
  await refresh()
}

useSeoMeta({
  title: `${topic_data.value.topic.name}`,
})

const topic_done = async (id)=>{
  loading.value = true
  await $api.trainer.topic_done(id)
  await refresh()
  loading.value = false
}
</script>

<template>
<!--  <pre>{{topic}}</pre>-->
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Тренажер', to: '/courses/trainer/' },
    { label: topic_data.course.name, to: `/courses/trainer/${course_slug}`  },
    { label: topic_data.level.name, to: `/courses/trainer/${course_slug}/${level_slug}`  },
    { label: topic_data.topic.name  },

  ]"/>
  <BlockCourseHeader  :title="topic_data.topic.name" />
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-4">
      <CardBase padding="sm" class="space-y-3">
        <div @click="openAudio(audio_file)" class="hidden md:block cursor-pointer border border-[#E8E8E9] px-5 py-4 rounded-3xl"
             :class="!show_test ? 'bg-[#F6F6FB]' : '' "
             v-for="audio_file in topic_data.topic.audio_files">
          <div class="flex items-center gap-5">

            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="46" rx="23" fill="#EFEFF5"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.1747 14.9417C19.9658 14.8044 19.7175 14.7208 19.4576 14.7003C19.1976 14.6797 18.9362 14.7231 18.7028 14.8254C18.4693 14.9277 18.2729 15.085 18.1357 15.2797C17.9985 15.4743 17.9258 15.6986 17.9258 15.9275V30.7132C17.9258 30.942 17.9985 31.1663 18.1357 31.3609C18.2729 31.5556 18.4693 31.7129 18.7028 31.8152C18.9362 31.9176 19.1976 31.9609 19.4576 31.9403C19.7175 31.9198 19.9658 31.8362 20.1747 31.6989L31.4191 24.306C31.5937 24.1913 31.7354 24.0424 31.8329 23.8713C31.9305 23.7003 31.9813 23.5116 31.9813 23.3203C31.9813 23.129 31.9305 22.9404 31.8329 22.7693C31.7354 22.5982 31.5937 22.4494 31.4191 22.3346L20.1747 14.9417Z" fill="#3333E8"/>
            </svg>
            <div class="">
              <TypingText18 :text="audio_file.name"/>
              <p class="text-sm text-gray-400 font-normal">{{audio_file.description}}</p>
            </div>

          </div>
        </div>


        <div
            v-for="audio_file in topic_data.topic.audio_files"
            :key="audio_file.id"
            class="block md:hidden border border-[#E8E8E9] px-5 py-4 rounded-3xl"
            :class="!show_test ? 'bg-[#F6F6FB]' : ''"
        >
          <div
              @click.stop="openAudioMobile(audio_file)"
              class="flex items-center gap-5 cursor-pointer"
          >
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="46" rx="23" fill="#EFEFF5"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M20.1747 14.9417C19.9658 14.8044 19.7175 14.7208 19.4576 14.7003C19.1976 14.6797 18.9362 14.7231 18.7028 14.8254C18.4693 14.9277 18.2729 15.085 18.1357 15.2797C17.9985 15.4743 17.9258 15.6986 17.9258 15.9275V30.7132C17.9258 30.942 17.9985 31.1663 18.1357 31.3609C18.2729 31.5556 18.4693 31.7129 18.7028 31.8152C18.9362 31.9176 19.1976 31.9609 19.4576 31.9403C19.7175 31.9198 19.9658 31.8362 20.1747 31.6989L31.4191 24.306C31.5937 24.1913 31.7354 24.0424 31.8329 23.8713C31.9305 23.7003 31.9813 23.5116 31.9813 23.3203C31.9813 23.129 31.9305 22.9404 31.8329 22.7693C31.7354 22.5982 31.5937 22.4494 31.4191 22.3346L20.1747 14.9417Z" fill="#3333E8"/>
            </svg>
            <div class="flex w-full items-start justify-between">
              <div class="">
                <TypingText18 :text="audio_file.name"/>
                <p class="text-sm text-gray-400 font-normal">{{ audio_file.description }}</p>
              </div>
                <Button v-if="show_player" @click.stop="stopAudioMobile" size="small" outlined rounded icon="pi pi-times"/>
            </div>
          </div>

          <!-- Плавное появление/скрытие плеера -->
          <Transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-show="show_player" class="mt-4">
              <BlockAudioPlayer v-if="current_audio"  :play="is_play" :src="current_audio.mp3" />
            </div>
          </Transition>
        </div>








        <div @click="show_test=true" class="cursor-pointer border border-[#E8E8E9] px-5 py-4 rounded-3xl" :class="show_test ? 'bg-[#F6F6FB]' : '' ">
          <div class="flex items-center gap-5">

            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="46" height="46" rx="23" fill="#EFEFF5"/>
              <path d="M23.659 33H29C29.5304 33 30.0391 32.7893 30.4142 32.4142C30.7893 32.0391 31 31.5304 31 31V19C31.0008 18.6831 30.9388 18.3692 30.8176 18.0764C30.6964 17.7836 30.5185 17.5177 30.294 17.294L26.706 13.706C26.4823 13.4815 26.2164 13.3036 25.9236 13.1824C25.6308 13.0612 25.3169 12.9992 25 13H17C16.4696 13 15.9609 13.2107 15.5858 13.5858C15.2107 13.9609 15 14.4696 15 15V24.34" stroke="#3333E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M25.001 13V18C25.001 18.2652 25.1064 18.5196 25.2939 18.7071C25.4814 18.8946 25.7358 19 26.001 19H31.001M21.379 23.622C21.7772 23.2242 22.3172 23.0008 22.8801 23.0011C23.443 23.0014 23.9827 23.2253 24.3805 23.6235C24.7783 24.0217 25.0017 24.5617 25.0014 25.1246C25.0011 25.6875 24.7772 26.2272 24.379 26.625L19.361 31.637C19.1234 31.8748 18.8297 32.0488 18.507 32.143L15.64 32.98C15.554 33.0051 15.4627 33.0066 15.3759 32.9844C15.2891 32.9621 15.2098 32.9169 15.1464 32.8536C15.0831 32.7902 15.0379 32.7109 15.0156 32.6241C14.9934 32.5373 14.9949 32.446 15.02 32.36L15.856 29.491C15.9504 29.1687 16.1244 28.8753 16.362 28.638L21.379 23.622Z" stroke="#3333E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div class="">
              <TypingText18 text="Тест"/>
              <p class="text-sm text-gray-400 font-normal">Интерактивный урок</p>
            </div>

          </div>
        </div>
      </CardBase>
    </div>
    <div class="col-span-12 md:col-span-8 pb-20">

      <CardBase v-if="show_test" padding="md">
          <TypingText28 text="Проверьте себя" class="mb-6"/>
        <div class="space-y-1 mb-4 ">
          <CardVoiceFile
              v-for="item in topic_data.topic.phrases"
              :reverse="false"
              :show_add_to_fav="false"
              :opened="false"
              :loading="false"
              :key="item.id"
              :item="item"
              @toggle_fav="handleToggleFav" />
        </div>

        <Button
                fluid
                severity="success"
                icon="pi pi-check-circle"
                :outlined="!topic_data.topic.is_done"
                :loading="loading"
                @click="topic_data.topic.is_done ? null : topic_done(topic_data.topic.id)"
                label="Выполнено"/>

      </CardBase>
      <CardBase v-else padding="sm" class="hidden md:flex  bg-[url('/a_bg.png')]  bg-top bg-no-repeat bg-cover
          flex-col items-center justify-evenly р-[300px] md:h-[500px]">
        <div class="text-center">
          <TypingText28 :text="current_audio?.name" class="mb-1"/>
          <p class="text-gray-500">{{current_audio?.description}}</p>
        </div>
        <div class="px-0 md:px-10 w-full">
        <BlockAudioPlayer v-if="current_audio" :src="current_audio?.mp3" />
        </div>
      </CardBase>
    </div>
  </div>
</template>

<style scoped>

</style>