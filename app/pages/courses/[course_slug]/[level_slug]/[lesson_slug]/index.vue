<!--lesson_slug-->
<script setup lang="ts">
type ViewMode = "module" | "videos" | "table" | "trainer"

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
const viewMode = ref<ViewMode>("module")
const dictionary_modal_visible = ref(false)
const table = ref(null)
const videos = ref([])
const config = useRuntimeConfig();

const dictionary_direction = ref('ruEN')

const isPlaying = ref(false)
const audio = new Audio()
audio.src = lesson.value.file
const play = () => {
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {

    audio.play()
    isPlaying.value = true
  }
}

audio.addEventListener('ended', () => {
  isPlaying.value = false
})

const handleToggleOpen = (id: number) => {
  openedId.value = openedId.value === id ? null : id
}
const handleToggleDictionaryOpen = (id: number) => {
  opened_dictionary_id.value = opened_dictionary_id.value === id ? null : id
}

const fetch_module = async (id) => {
  current_module.value= id
  viewMode.value = "module"
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

const fetchTable = async () => {
  if (!table.value) {
    const resp =  await $api.lessons.lesson_table(lesson_slug)
    table.value = resp.table
  }
  viewMode.value = "table"
}

const fetchVideos = async () => {
  if (videos.value.length === 0) {
    videos.value = await $api.lessons.lesson_videos(lesson_slug)
  }
  viewMode.value = "videos"
}


</script>


<template>
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Курсы', to: '/courses' },
    { label: lesson.level_title, to: `/courses/${course_slug}/${level_slug}` },
    { label: lesson.title },
  ]"
  />
  <BlockCourseHeader :title="lesson.title" show_profile/>
  <a v-if="user.is_superuser" target="_blank" :href="`${config.public.apiUrl}/admin/lesson/lesson/${lesson.id}/change/`">
    <Button outlined severity="secondary" icon="pi pi-pencil" label="Редактировать урок"/>
  </a>
  <Button @click="dictionary_modal_visible = true" fluid outlined class="mb-4 block md:hidden" label="Словарь"/>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-3 ">
      <CardBase padding="sm" class="mb-4 sticky top-5 space-y-1">
        <p
            v-for="(module, i) in lesson.modules"
            :key="i"
            @click="fetch_module(module.id)"
            class="w-full cursor-pointer flex items-center justify-between gap-2 p-3 rounded-2xl hover:bg-[#F6F6FB] transition-[0.2s] duration-[ease-in-out] ease-[all]"
            :class="{
              'bg-[#F6F6FB]': viewMode === 'module' && current_module === module.id
            }"
        >
          <span> {{ i + 1 }}. {{ module.title }}</span>
          <i v-if="module.is_done" class="text-green-500 pi pi-check-circle"></i>
        </p>
        <div  class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer  hover:bg-[#F6F6FB]"
              @click="fetchVideos"
              :class="viewMode === 'videos' ? 'bg-[#efeff5]' : 'bg-white'"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
            <path d="M20.573 28.6957H25.2174C25.6786 28.6957 26.121 28.5124 26.4471 28.1863C26.7733 27.8601 26.9565 27.4178 26.9565 26.9565V16.5217C26.9572 16.2462 26.9033 15.9732 26.7979 15.7186C26.6926 15.464 26.5378 15.2328 26.3426 15.0383L23.2226 11.9183C23.0281 11.7231 22.7969 11.5683 22.5423 11.4629C22.2877 11.3576 22.0147 11.3037 21.7391 11.3044H14.7826C14.3214 11.3044 13.879 11.4876 13.5529 11.8137C13.2267 12.1399 13.0435 12.5822 13.0435 13.0435V21.1652" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.74 11.3043V15.6522C21.74 15.8828 21.8316 16.104 21.9947 16.267C22.1578 16.4301 22.3789 16.5217 22.6096 16.5217H26.9574M18.5904 20.5409C18.9367 20.1949 19.4062 20.0007 19.8957 20.001C20.3852 20.0012 20.8545 20.1959 21.2004 20.5422C21.5464 20.8885 21.7406 21.358 21.7403 21.8474C21.7401 22.3369 21.5454 22.8062 21.1991 23.1522L16.8357 27.5104C16.629 27.7172 16.3736 27.8685 16.093 27.9504L13.6 28.6783C13.5252 28.7001 13.4459 28.7014 13.3704 28.682C13.2949 28.6627 13.2259 28.6234 13.1708 28.5683C13.1157 28.5132 13.0764 28.4443 13.0571 28.3688C13.0377 28.2933 13.039 28.214 13.0609 28.1391L13.7878 25.6443C13.8699 25.3641 14.0212 25.109 14.2278 24.9026L18.5904 20.5409Z" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Видео</p>
        </div>
        <div v-if="lesson.have_table" class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer  hover:bg-[#F6F6FB]"
             @click="fetchTable"
             :class="viewMode === 'table' ? 'bg-[#efeff5]' : 'bg-white'"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
            <path d="M20.573 28.6957H25.2174C25.6786 28.6957 26.121 28.5124 26.4471 28.1863C26.7733 27.8601 26.9565 27.4178 26.9565 26.9565V16.5217C26.9572 16.2462 26.9033 15.9732 26.7979 15.7186C26.6926 15.464 26.5378 15.2328 26.3426 15.0383L23.2226 11.9183C23.0281 11.7231 22.7969 11.5683 22.5423 11.4629C22.2877 11.3576 22.0147 11.3037 21.7391 11.3044H14.7826C14.3214 11.3044 13.879 11.4876 13.5529 11.8137C13.2267 12.1399 13.0435 12.5822 13.0435 13.0435V21.1652" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.74 11.3043V15.6522C21.74 15.8828 21.8316 16.104 21.9947 16.267C22.1578 16.4301 22.3789 16.5217 22.6096 16.5217H26.9574M18.5904 20.5409C18.9367 20.1949 19.4062 20.0007 19.8957 20.001C20.3852 20.0012 20.8545 20.1959 21.2004 20.5422C21.5464 20.8885 21.7406 21.358 21.7403 21.8474C21.7401 22.3369 21.5454 22.8062 21.1991 23.1522L16.8357 27.5104C16.629 27.7172 16.3736 27.8685 16.093 27.9504L13.6 28.6783C13.5252 28.7001 13.4459 28.7014 13.3704 28.682C13.2949 28.6627 13.2259 28.6234 13.1708 28.5683C13.1157 28.5132 13.0764 28.4443 13.0571 28.3688C13.0377 28.2933 13.039 28.214 13.0609 28.1391L13.7878 25.6443C13.8699 25.3641 14.0212 25.109 14.2278 24.9026L18.5904 20.5409Z" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Таблица</p>
        </div>
        <div class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer  hover:bg-[#F6F6FB]" @click="viewMode = 'trainer'"
             :class="viewMode === 'trainer' ? 'bg-[#efeff5]' : 'bg-white'"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
            <path d="M20.573 28.6957H25.2174C25.6786 28.6957 26.121 28.5124 26.4471 28.1863C26.7733 27.8601 26.9565 27.4178 26.9565 26.9565V16.5217C26.9572 16.2462 26.9033 15.9732 26.7979 15.7186C26.6926 15.464 26.5378 15.2328 26.3426 15.0383L23.2226 11.9183C23.0281 11.7231 22.7969 11.5683 22.5423 11.4629C22.2877 11.3576 22.0147 11.3037 21.7391 11.3044H14.7826C14.3214 11.3044 13.879 11.4876 13.5529 11.8137C13.2267 12.1399 13.0435 12.5822 13.0435 13.0435V21.1652" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.74 11.3043V15.6522C21.74 15.8828 21.8316 16.104 21.9947 16.267C22.1578 16.4301 22.3789 16.5217 22.6096 16.5217H26.9574M18.5904 20.5409C18.9367 20.1949 19.4062 20.0007 19.8957 20.001C20.3852 20.0012 20.8545 20.1959 21.2004 20.5422C21.5464 20.8885 21.7406 21.358 21.7403 21.8474C21.7401 22.3369 21.5454 22.8062 21.1991 23.1522L16.8357 27.5104C16.629 27.7172 16.3736 27.8685 16.093 27.9504L13.6 28.6783C13.5252 28.7001 13.4459 28.7014 13.3704 28.682C13.2949 28.6627 13.2259 28.6234 13.1708 28.5683C13.1157 28.5132 13.0764 28.4443 13.0571 28.3688C13.0377 28.2933 13.039 28.214 13.0609 28.1391L13.7878 25.6443C13.8699 25.3641 14.0212 25.109 14.2278 24.9026L18.5904 20.5409Z" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>Орфография</p>
        </div>
        <div class="flex items-center gap-3 border rounded-lg p-3 cursor-pointer bg-white hover:bg-[#F6F6FB]" @click="play">
          <svg v-if="!isPlaying" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8656 13.2C17.7171 13.0886 17.5404 13.0207 17.3554 13.004C17.1705 12.9874 16.9845 13.0225 16.8184 13.1056C16.6523 13.1886 16.5126 13.3163 16.415 13.4743C16.3173 13.6322 16.2656 13.8143 16.2656 14V26C16.2656 26.1857 16.3173 26.3678 16.415 26.5257C16.5126 26.6837 16.6523 26.8114 16.8184 26.8944C16.9845 26.9775 17.1705 27.0126 17.3554 26.996C17.5404 26.9793 17.7171 26.9114 17.8656 26.8L25.8656 20.8C25.9898 20.7069 26.0906 20.5861 26.1601 20.4472C26.2295 20.3084 26.2656 20.1552 26.2656 20C26.2656 19.8448 26.2295 19.6916 26.1601 19.5528C26.0906 19.4139 25.9898 19.2931 25.8656 19.2L17.8656 13.2Z" fill="#3333E8"/>
          </svg>
          <svg v-else width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
            <path d="M14 26.4V13.6C14 13.4409 14.0632 13.2883 14.1757 13.1757C14.2883 13.0632 14.4409 13 14.6 13H17.4C17.5591 13 17.7117 13.0632 17.8243 13.1757C17.9368 13.2883 18 13.4409 18 13.6V26.4C18 26.5591 17.9368 26.7117 17.8243 26.8243C17.7117 26.9368 17.5591 27 17.4 27H14.6C14.4409 27 14.2883 26.9368 14.1757 26.8243C14.0632 26.7117 14 26.5591 14 26.4ZM22 26.4V13.6C22 13.4409 22.0632 13.2883 22.1757 13.1757C22.2883 13.0632 22.4409 13 22.6 13H25.4C25.5591 13 25.7117 13.0632 25.8243 13.1757C25.9368 13.2883 26 13.4409 26 13.6V26.4C26 26.5591 25.9368 26.7117 25.8243 26.8243C25.7117 26.9368 25.5591 27 25.4 27H22.6C22.4409 27 22.2883 26.9368 22.1757 26.8243C22.0632 26.7117 22 26.5591 22 26.4Z" fill="#3333E8" stroke="#3333E8" stroke-width="1.5"/>
          </svg>
          <p>Аудиоурок</p>
        </div>


      </CardBase>


    </div>

    <div class="col-span-12 md:col-span-6">
      <template v-if="loading">
        <div class="space-y-3">
          <SkeletonLessonCard />
        </div>
      </template>
      <template v-else>
        <template v-if="viewMode === 'table'">
          <CardBase padding="sm" >
            <img :src="table"/>
          </CardBase>
        </template>
        <template  v-else-if="viewMode === 'trainer'">
          <CardBase padding="sm" >
            <p class="text-lg font-medium mb-2">Орфография</p>

            <p class="font-medium mb-2">{{lesson.orthography_description}}</p>
            <CardSpellingTrainer v-for="item in lesson.orthography_items" :item="item" lang="ru"/>
          </CardBase>
        </template>

        <template v-else-if="viewMode === 'videos'">
          <CardBase padding="sm">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="" v-for="video in videos" :key="video.id">
                {{video.video_number}}
                <BlockVideoWithPreview :showPreview = "true" :data="video"/>

              </div>

            </div>

          </CardBase>

        </template>
        <template v-else>
          <div class="space-y-3 mb-6">
            <CardBase padding="sm" v-for="(block,index) in module?.blocks" :key="block.id">
              <!--              <p class="text-[16px] md:text-lg font-medium mb-2">{{module.index}}.{{index+1}}</p>-->

              <div class="text-lg font-medium mb-3" v-html="block.caption === '  None' ? '' : block.caption"></div>

              <div v-if="block.videos.length > 0 && block.videos[0].phrases.length === 0" class="mt-3 ">
                <img @click="videoSelected(block.videos[0].video_src)" class="cursor-pointer" src="~assets/images/tutorial_video.png">

              </div>
              <div v-if="block.videos.length > 0 && block.videos[0].phrases.length > 0" class="mt-3">
                <BlockVideoWithPreview :showPreview = "false" :data="block.videos[0]"/>
              </div>
              <div v-if="block.type3_content" v-html="block.type3_content" class="mt-3"></div>
              <div v-if="block.items.length>0" class="space-y-1">
                <CardVoiceFile
                    v-for="item in block.items"
                    :key="item.id"
                    :item="item"
                    :opened="openedId === item.id"
                    :loading="fav_loading"
                    :show_add_to_fav="true"
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
                <a v-if="user.is_superuser" target="_blank" :href="`${config.public.apiUrl}/admin/lesson/moduleblock/${block.id}/change/`">
                  <Button outlined severity="secondary" icon="pi pi-pencil"/>
                </a>
              </div>

            </CardBase>
          </div>
          <!--          <div class="grid grid-cols-2 gap-3">-->
          <!--            <Button outlined icon="pi pi-arrow-left" label="Предыдущий урок"/>-->
          <!--            <Button  icon-pos="right" icon="pi pi-arrow-right" label="Следующий урок"/>-->
          <!--          </div>-->
        </template>


      </template>

    </div>
    <div class="hidden md:block col-span-3 sticky top-5 h-[90vh]">
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
        <div class="space-y-1 mb-3"
             v-for="group in  module?.module_dictionary_groups.length>0 ? module?.module_dictionary_groups : lesson.dictionary_groups ">

          <a v-if="user.is_superuser" target="_blank" :href="`${config.public.apiUrl}/admin/lesson/dictionarygroup/${group.id}/change/`">
            <Button outlined  severity="secondary" icon="pi pi-pencil" :label="`${group.title}`"/>
          </a>
          <TypingText18 v-else :text="group.title"/>

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
  <Dialog v-model:visible="dictionary_modal_visible"
          modal
          header="Словарь"
          class="relative"
          :style="{ width: '35rem','padding': '0' }">


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
    <div class="space-y-1 mb-3"
         v-for="group in  module?.module_dictionary_groups.length>0 ? module?.module_dictionary_groups : lesson.dictionary_groups ">
      <TypingText18 :text="group.title"/>
      <CardDictionaryItem :dictionary_direction="dictionary_direction"
                          :item="item"
                          v-for="item in group.items"
                          :opened="opened_dictionary_id === item.id"
                          @toggle_open="handleToggleDictionaryOpen"
                          @toggle_fav="handleToggleFav"
                          :loading="fav_loading"/>
    </div>

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