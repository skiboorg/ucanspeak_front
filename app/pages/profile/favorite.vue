<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:dictionary_favorites,refresh:refresh_dictionary_favorites} = useHttpRequest(await useAsyncData(()=>$api.lessons.dictionary_favorites()))
const {data:lesson_item_favorites,refresh:refresh_lesson_item_favorites} = useHttpRequest(await useAsyncData(()=>$api.lessons.lesson_item_favorites()))
const {data:trainer_item_favorites,refresh:refresh_trainer_item_favorites} = useHttpRequest(await useAsyncData(()=>$api.trainer.favorites()))

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
    <TypingText18 text="Словарь" class="mb-3"/>
    <div class="grid grid-cols-3 gap-4 mb-6">
      <CardDictionaryItem v-if="dictionary_favorites.length>0" :item="item" v-for="item in dictionary_favorites" @toggle_fav="handleToggleDictionaryFav"/>
      <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
    </div>
    <TypingText18 text="Фразы уроков" class="mb-3"/>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <CardVoiceFile v-if="lesson_item_favorites.length>0" v-for="item in lesson_item_favorites" :key="item.id" :item="item" @toggle_fav="handlePhraseToggleFav"/>
      <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
    </div>
    <TypingText18 text="Тренажер" class="mb-3"/>
    <div class="grid grid-cols-2 gap-4 ">
      <CardVoiceFile v-if="trainer_item_favorites.length>0" v-for="item in trainer_item_favorites" :key="item.id" :item="item" @toggle_fav="handleTrainerToggleFav"/>
      <p v-else class="text-sm text-gray-400 font-normal">В избранном пока ничего нет</p>
    </div>

  </CardBase>
</template>

<style scoped>

</style>