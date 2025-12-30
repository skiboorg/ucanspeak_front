<!--lesson_slug-->
<script setup lang="ts">
const {$api} = useNuxtApp()
const {lesson_slug, level_slug, course_slug}  = useRoute().params
const {m_id} = useRoute().query
const current_module = ref(null)
const {data:lesson,refresh,pending} = useHttpRequest(await useAsyncData(()=>$api.lessons.lesson(lesson_slug)))
const video_tutorial_modal_visible = ref(false)
const loading = ref(false)
const fav_loading = ref(false)
const module = ref(null)
const tutorial_video = ref(null)
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
const openedId = ref<number | null>(null)
const opened_dictionary_id = ref<number | null>(null)

const dictionary_direction = ref('ruEN')

const isPlaying = ref(false)
const audio = new Audio()

const play = () => {
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {
    audio.src = lesson.value.mp3
    audio.play()
    isPlaying.value = true
  }
}

const handleToggleOpen = (id: number) => {
  openedId.value = openedId.value === id ? null : id
}
const handleToggleDictionaryOpen = (id: number) => {
  opened_dictionary_id.value = opened_dictionary_id.value === id ? null : id
}

const fetch_module = async (id) => {
  current_module.value= id
  loading.value = true
  await nextTick()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  try{
    module.value = await $api.lessons.module(id)
  }catch(error){}
  finally{
    loading.value = false

  }
}

onMounted(async () => {
  const id = m_id ? Number(m_id) : lesson.value.modules[0].id
  await fetch_module(id)
})

const videoSelected = (video_src) =>{
  tutorial_video.value = video_src
  video_tutorial_modal_visible.value = true
}

const toggleBlockDone = async (id,index) => {
  loading.value = false
  module.value.blocks.splice(index, 1, {
    ...module.value.blocks[index],
    is_done: !module.value.blocks[index].is_done
  })
  await $api.lessons.toggle_block({id})
  await refresh()
  loading.value = false
}

const handleToggleFav = async (id) => {
  fav_loading.value = true
  await $api.lessons.toggle_dictionary_favorite({
    id: id
  })
  await refresh()
  fav_loading.value = false
}
const handlePharaseToggleFav = async (id) => {
  fav_loading.value = true
  await $api.lessons.toggle_phrase_favorite({
    id: id
  })
  fav_loading.value = false
}
</script>

<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Курсы', to: '/courses' },
    { label: level_slug, to: `/courses/${course_slug}/${level_slug}` },
    { label: lesson.title },
  ]"
  />
  <BlockCourseHeader :title="lesson.title" show_profile/>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-3 ">
      <CardBase padding="sm" class="mb-4 sticky top-5 space-y-2">
        <p
            v-for="(module, i) in lesson.modules"
            :key="i"
            @click="fetch_module(module.id)"
            class="w-full cursor-pointer flex items-center justify-between gap-2 p-4 rounded-2xl hover:bg-[#efeff5] transition-[0.2s] duration-[ease-in-out] ease-[all]"
            :class="{
                'bg-[#efeff5]': current_module===module.id
            }"
        >
          <span> {{ i + 1 }}. {{ module.title }}</span>
          <i v-if="module.is_done" class="text-green-500 pi pi-check-circle"></i>
        </p>

        <div class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer" @click="play">
          <div class=" w-10 h-10 rounded-full bg-[#EFEFF5] flex items-center justify-center">
            <i class="text-primary" :class="isPlaying ?  'pi pi-pause' : 'pi pi-play'"></i>
          </div>

          <p>Аудиоурок</p>
        </div>
      </CardBase>


    </div>
    <div class="col-span-6">
      <template v-if="loading">
        <div class="space-y-3">
          <SkeletonLessonCard />
        </div>
      </template>
      <template v-else>
        <div class="space-y-3 mb-6">
          <CardBase padding="sm" v-for="(block,index) in module?.blocks" :key="block.id">
            <p class="text-lg font-medium mb-2">{{module.index}}.{{index+1}}</p>

            <div class="text-lg font-medium" v-html="block.caption"></div>

            <div v-if="block.videos.length > 0 && block.videos[0].phrases.length === 0" class="mt-3 ">
              <img @click="videoSelected(block.videos[0].video_src)" class="cursor-pointer" src="~assets/images/tutorial_video.png">

            </div>
            <div v-if="block.videos.length > 0 && block.videos[0].phrases.length > 0" class="mt-3">
              <BlockKaraoke :data="block.videos[0]"/>
            </div>
            <div v-if="block.type3_content" v-html="block.type3_content" class="mt-3"></div>
            <div v-if="block.items.length>0" class="space-y-3">
              <CardVoiceFile
                  v-for="item in block.items"
                  :key="item.id"
                  :item="item"
                  :opened="openedId === item.id"
                  :loading="fav_loading"
                  @toggle_open="handleToggleOpen"
                  @toggle_fav="handlePharaseToggleFav"
              />
            </div>
            <div class="flex gap-4 mt-3">
              <Button v-if="block.can_be_done" @click="toggleBlockDone(block.id,index)"
                      fluid
                      severity="success"
                      :icon="block.is_done ? 'pi pi-check-circle' :'' "
                      :outlined="!block.is_done"
                      label="Выполнено"/>
              <a v-if="user.is_superuser" target="_blank" :href="`http://localhost:8000/admin/lesson/moduleblock/${block.id}/change/`">
                <Button outlined severity="secondary" icon="pi pi-pencil"/>
              </a>
            </div>

          </CardBase>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <Button outlined icon="pi pi-arrow-left" label="Предыдущий урок"/>
          <Button  icon-pos="right" icon="pi pi-arrow-right" label="Следующий урок"/>
        </div>
      </template>

    </div>
    <div class="col-span-3 sticky top-5 h-[90vh]">
      <CardBase padding="sm" class="h-[90vh] overflow-y-auto">
        <TypingText20 text="Словарь" class="mb-4"/>
        <div class="border border-[#D1D1E0] rounded-lg px-6 py-3 flex items-center justify-between mb-4 cursor-pointer"
             @click="dictionary_direction === 'ruEN' ? dictionary_direction = 'enRU' : dictionary_direction = 'ruEN'">
          <p >{{dictionary_direction==='ruEN' ? 'Русский' : 'Английский'}} </p>
          <svg width="63" height="28" viewBox="0 0 63 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="63" height="28" rx="14" fill="#EFEFF5"/>
            <path d="M24 11.918H39L34 6.91797M39.3329 16.0846H24.3329L29.3329 21.0846" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p >{{dictionary_direction==='ruEN' ? 'Английский' : 'Русский'}} </p>
          <p></p>
        </div>
        <div class="space-y-3 mb-3"
             v-for=" group in  module?.module_dictionary_groups.length>0 ? module?.module_dictionary_groups : lesson.dictionary_groups ">
          <TypingText18 :text="group.title"/>
          <CardDictionaryItem :dictionary_direction="dictionary_direction"
                              :item="item"
                              v-for="item in group.items"
                              :opened="opened_dictionary_id === item.id"
                              @toggle_open="handleToggleDictionaryOpen"
                              @toggle_fav="handleToggleFav"
                              :loading="fav_loading"/>
        </div>
      </CardBase>
    </div>
  </div>
  <Dialog v-model:visible="video_tutorial_modal_visible"
          modal
          :show-header="false"
          header="Edit Profile"
          class="relative"
          :style="{ width: '35rem','padding': '0' }">
    <i class="pi pi-times absolute top-3 right-3 cursor-pointer z-40" @click="video_tutorial_modal_visible=false"></i>
    <video width="100%" height="auto" preload="none" playsinline="true" id="video_player"
           controls="controls" autoplay="autoplay">
      <source :src="`https://platform.ucanspeak.ru/${tutorial_video}`" type="video/mp4">
    </video>
  </Dialog>
</template>

<style >
/* Общие стили таблицы */
table {
  width: 100%;
  border-collapse: collapse; /* убирает двойные границы */

}
td, th {
  border: 1px solid #e3e3e3 !important;
}
/* Заголовки таблицы */
thead th {
  background-color: #f3f4f6; /* светлый серый фон */
  color: #111827; /* тёмный текст */
  text-align: left;
  padding: 12px 16px;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem; /* 14px */
}

/* Строки таблицы */
tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody td[rowspan]:nth-child(3) {
  background-color: rgba(225, 225, 225, 0.24);
  font-weight: 600;
  text-align: center;
}

/* Ячейки таблицы */
tbody td {
  padding: 12px 16px;
  font-size: 0.875rem;
  color: #374151;
}

/* Чередование строк */
tbody tr:nth-child(even) {
  background-color: #f9fafb;
}


</style>