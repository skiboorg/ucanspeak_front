<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:dictionary_favorites,refresh:refresh_dictionary_favorites} = useHttpRequest(await useAsyncData(()=>$api.lessons.dictionary_favorites()))
const {data:lesson_item_favorites,refresh:refresh_lesson_item_favorites} = useHttpRequest(await useAsyncData(()=>$api.lessons.lesson_item_favorites()))
const {data:trainer_item_favorites,refresh:refresh_trainer_item_favorites} = useHttpRequest(await useAsyncData(()=>$api.trainer.favorites()))
const openedId = ref<number | null>(null)
const opened_dictionary_id = ref<number | null>(null)
const handleToggleOpen = (id: number) => {
  openedId.value = openedId.value === id ? null : id
}
const handleToggleDictionaryOpen = (id: number) => {
  opened_dictionary_id.value = opened_dictionary_id.value === id ? null : id
}


const handleToggleDictionaryFav = async (id) => {
  await $api.lessons.toggle_dictionary_favorite({
    id: id
  })
  await refresh_dictionary_favorites()
}
const handlePhraseToggleFav = async (id) => {
  await $api.lessons.toggle_phrase_favorite({
    id: id
  })
  await refresh_lesson_item_favorites()
}
const handleTrainerToggleFav = async (id) => {
  await $api.trainer.toggle_trainer_favorite({
    id: id
  })
  await refresh_trainer_item_favorites()
}
</script>

<template>
  <CardBase padding="md">
    <TypingText28 text="Избранное" class="mb-6"/>
    <div class="mb-3">
      <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-search"></i>
      </InputGroupAddon>
      <InputText  placeholder="Поиск" />
      </InputGroup>
    </div>

    <Tabs value="0" class="relative">

        <TabList>
          <Tab value="0">Слова</Tab>
          <Tab value="1">Фразы</Tab>
          <Tab value="2">Тренажер</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div v-if="dictionary_favorites.length>0" class="relative md:absolute cursor-pointer right-0 md:top-4 flex items-center justify-end gap-2 mb-3">
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14 3V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H6C5.46957 0 4.96086 0.210714 4.58579 0.585786C4.21071 0.960859 4 1.46957 4 2V3H1C0.734784 3 0.48043 3.10536 0.292893 3.29289C0.105357 3.48043 0 3.73478 0 4C0 4.26522 0.105357 4.51957 0.292893 4.70711C0.48043 4.89464 0.734784 5 1 5H2V16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19H13C13.7956 19 14.5587 18.6839 15.1213 18.1213C15.6839 17.5587 16 16.7956 16 16V5H17C17.2652 5 17.5196 4.89464 17.7071 4.70711C17.8946 4.51957 18 4.26522 18 4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H14ZM12 2H6V3H12V2ZM14 5H4V16C4 16.2652 4.10536 16.5196 4.29289 16.7071C4.48043 16.8946 4.73478 17 5 17H13C13.2652 17 13.5196 16.8946 13.7071 16.7071C13.8946 16.5196 14 16.2652 14 16V5Z" fill="#8F8FA3"/>
                <path d="M6 7H8V15H6V7ZM10 7H12V15H10V7Z" fill="#8F8FA3"/>
              </svg>
              <p  class="text-gray-400">Очистить избранное</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-1 mb-6">

              <CardDictionaryItem v-if="dictionary_favorites.length>0"
                                  :item="item" v-for="item in dictionary_favorites"
                                  dictionary_direction="ruEN"
                                  :opened="opened_dictionary_id === item.id"
                                  @toggle_open="handleToggleDictionaryOpen"
                                  @toggle_fav="handleToggleDictionaryFav"/>
              <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
            </div>
          </TabPanel>
          <TabPanel value="1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6">
              <CardVoiceFile v-if="lesson_item_favorites.length>0"
                             v-for="item in lesson_item_favorites"
                             :key="item.id"
                             :item="item"
                             :show_add_to_fav="true"
                             :opened="openedId === item.id"
                             @toggle_open="handleToggleOpen"
                             @toggle_fav="handlePhraseToggleFav"/>
              <p v-else class="text-sm text-gray-400 font-normal w-full">В избранном пока ничего нет</p>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1 ">
              <CardVoiceFile v-if="trainer_item_favorites.length>0"
                             v-for="item in trainer_item_favorites"
                             :key="item.id"
                             :item="item"
                             :show_add_to_fav="true"
                             :opened="openedId === item.id"
                             @toggle_open="handleToggleOpen"
                             @toggle_fav="handleTrainerToggleFav"/>
              <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
  </CardBase>
</template>

<style scoped>

</style>