<script setup lang="ts">
const audio = new Audio()

const props = defineProps<{
  item: any
  loading: boolean
  opened: boolean
}>()
const emits = defineEmits(['toggle_fav','toggle_open'])

const isOpen = ref<boolean>(false)
const isPlay = ref<boolean>(false)

const play = () => {
  isPlay.value = true
  audio.src = 'https://platform.ucanspeak.ru'+ props.item.sound
  audio.play()
  isPlay.value = false
}


</script>


<template>
<div class="">
  <div class="relative inline-flex items-start gap-4 " :class="opened ? 'h-[95px]' : 'h-auto'">
    <Button @click="play" icon="pi pi-play" outlined rounded/>
    <div class="bg-[#EFEFF5] overflow-hidden p-3 rounded-lg">

      <div @click="emits('toggle_open', item.id)"
           class="flex items-center gap-3 cursor-pointer">


        <div @click="play" class="flex items-center cursor-pointer">
          <div class="text-base leading-[130%]">
            <span v-if="opened">{{ item.text_ru }}</span>
            <span v-else>{{ item.text_ru }}</span>
          </div>
        </div>
        <UILikeBtn :class="loading ? 'disabled opacity-50' : ''" @click.stop="emits('toggle_fav',item.id)" v-model:value="item.is_like" />

      </div>

    </div>
    <div v-if="opened" class="right-0 bottom-0 absolute bg-[#7575F0] p-3 rounded-lg inline-block">
      <p  class="text-base leading-[130%] tracking-[-0.01em]  text-white">
        {{item.text_en}}
      </p>
    </div>
  </div>
</div>





</template>