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
<!--    <Button @click="play" icon="pi pi-play" outlined rounded/>-->
    <svg @click="play" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8617 13.2C17.7131 13.0886 17.5365 13.0207 17.3515 13.004C17.1666 12.9874 16.9806 13.0225 16.8145 13.1056C16.6484 13.1886 16.5087 13.3163 16.4111 13.4743C16.3134 13.6322 16.2617 13.8143 16.2617 14V26C16.2617 26.1857 16.3134 26.3678 16.4111 26.5257C16.5087 26.6837 16.6484 26.8114 16.8145 26.8944C16.9806 26.9775 17.1666 27.0126 17.3515 26.996C17.5365 26.9793 17.7131 26.9114 17.8617 26.8L25.8617 20.8C25.9859 20.7069 26.0867 20.5861 26.1561 20.4472C26.2256 20.3084 26.2617 20.1552 26.2617 20C26.2617 19.8448 26.2256 19.6916 26.1561 19.5528C26.0867 19.4139 25.9859 19.2931 25.8617 19.2L17.8617 13.2Z" fill="#3333E8"/>
    </svg>

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