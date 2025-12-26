<!--lesson_slug-->
<script setup lang="ts">
const {$api} = useNuxtApp()
const {lesson_slug, level_slug, course_slug}  = useRoute().params
const {m_id} = useRoute().query
const current_module = ref(null)
const {data:lesson,refresh,pending} = useHttpRequest(await useAsyncData(()=>$api.lessons.lesson(lesson_slug)))
const video_tutorial_modal_visible = ref(false)
const loading = ref(false)
const module = ref(null)
const tutorial_video = ref(null)
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)


const fetch_module = async (id) => {
  current_module.value= id
  loading.value = true
  try{
    module.value = await $api.lessons.module(id)
  }catch(error){}
  finally{
    loading.value = false
    await nextTick()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
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
  await $api.lessons.toggle_dictionary_favorite({
    id: id
  })
  await refresh()
}
const handlePharaseToggleFav = async (id) => {
  await $api.lessons.toggle_phrase_favorite({
    id: id
  })
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
      <CardBase padding="sm" class="sticky top-5 space-y-2">
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
      </CardBase>
    </div>
    <div class="col-span-6">
      <template v-if="loading">
        <div class="w-full h-screen flex flex-col items-center justify-center"></div>
        <ProgressSpinner />
      </template>
      <template v-else>
        <div class="space-y-3">
        <CardBase padding="sm" v-for="(block,index) in module?.blocks" :key="block.id">

          <div class="text-lg font-medium" v-html="block.caption"></div>

          <div v-if="block.videos.length > 0 && block.videos[0].phrases.length === 0" class="mt-3">
              <Button @click="videoSelected(block.videos[0].video_src)" label="Открыть видео" icon="pi pi-play"/>
          </div>
          <div v-if="block.videos.length > 0 && block.videos[0].phrases.length > 0" class="mt-3">
           <BlockKaraoke :data="block.videos[0]"/>
          </div>
          <div v-if="block.type3_content" v-html="block.type3_content" class="mt-3"></div>
          <div v-if="block.items.length>0" class="space-y-3">
            <CardVoiceFile v-for="item in block.items" :key="item.id" :item="item" @toggle_fav="handlePharaseToggleFav"/>
          </div>
          <div class="flex gap-4 mt-3">
            <Button @click="toggleBlockDone(block.id,index)"
                    fluid
                    severity="success"
                    :icon="block.is_done ? 'pi pi-check-circle' :'pi pi-check' "
                    :outlined="!block.is_done"
                    :label="block.is_done ? 'Выполнено' : 'Выполнить'"/>
            <a v-if="user.is_superuser" target="_blank" :href="`http://localhost:8000/admin/lesson/moduleblock/${block.id}/change/`">
              <Button outlined severity="secondary" icon="pi pi-pencil"/>
            </a>
          </div>

        </CardBase>
    </div>

      </template>

    </div>
    <div class="col-span-3">
      <CardBase padding="sm">
        <TypingText20 text="Словарь" class="mb-4"/>
        <div class="space-y-3 mb-3"
             v-for=" group in  module?.module_dictionary_groups.length>0 ? module?.module_dictionary_groups : lesson.dictionary_groups ">
          <TypingText18 :text="group.title"/>
          <CardDictionaryItem :item="item" v-for="item in group.items" @toggle_fav="handleToggleFav"/>
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