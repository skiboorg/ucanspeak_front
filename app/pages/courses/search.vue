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
  <BlockBaseBreadcrumbs
      :items="[
    { label: 'Главная', to: '/' },
    { label: 'Результаты поиска' },
  ]"/>
  <TypingText48 text="Поиск" class="mb-10"/>


  <CardBase padding="sm" class="space-y-3">
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-search"></i>
      </InputGroupAddon>
      <InputText   placeholder="Поиск" />
    </InputGroup>
    <p class="text-gray-400">Найдено 135 результатов</p>
    <Tabs value="0" class="relative">

      <TabList>
        <Tab value="0">Слова</Tab>
        <Tab value="1">Фразы</Tab>
        <Tab value="2">Тренажер</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="grid grid-cols-3 gap-4 mb-6">

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
          <div class="grid grid-cols-2 gap-4 mb-6">
            <CardVoiceFile v-if="lesson_item_favorites.length>0"
                           v-for="item in lesson_item_favorites"
                           :key="item.id"
                           :item="item"
                           :opened="openedId === item.id"
                           @toggle_open="handleToggleOpen"
                           @toggle_fav="handlePhraseToggleFav"/>
            <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div class="grid grid-cols-2 gap-4 ">
            <CardVoiceFile v-if="trainer_item_favorites.length>0"
                           v-for="item in trainer_item_favorites"
                           :key="item.id"
                           :item="item"
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