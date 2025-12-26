<script setup lang="ts">
const audio = new Audio()

const props = defineProps(['item','loading'])
const emits = defineEmits(['toggle_fav'])

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

    <div class="bg-[#EFEFF5] overflow-hidden p-3 rounded-lg">

        <div class="flex items-center select-none gap-3">

          <Button @click="play" icon="pi pi-play" outlined rounded/>
            <div @click="isOpen = !isOpen" class="flex items-center gap-[3px] cursor-pointer">
                <div class="text-base leading-[130%]">
                    <span v-if="isOpen">{{ item.text_ru }}</span>
                    <span v-else>{{ item.text_ru }}</span>
                </div>
                <svg
                    :class="{
                        'rotate-180': isOpen
                    }"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.9987 10.5007L13.2487 7.25065C13.4015 7.09787 13.5959 7.02149 13.832 7.02149C14.0681 7.02149 14.2626 7.09787 14.4154 7.25065C14.5681 7.40343 14.6445 7.59787 14.6445 7.83398C14.6445 8.0701 14.5681 8.26454 14.4154 8.41732L10.582 12.2507C10.4987 12.334 10.4084 12.3932 10.3112 12.4282C10.214 12.4632 10.1098 12.4804 9.9987 12.4798C9.88759 12.4793 9.78342 12.462 9.6862 12.4282C9.58898 12.3943 9.4987 12.3351 9.41537 12.2507L5.58203 8.41732C5.42926 8.26454 5.35287 8.0701 5.35287 7.83398C5.35287 7.59787 5.42926 7.40343 5.58203 7.25065C5.73481 7.09787 5.92925 7.02148 6.16537 7.02148C6.40148 7.02148 6.59592 7.09787 6.7487 7.25065L9.9987 10.5007Z" fill="#8F8FA3" />
                </svg>
            </div>
            <UILikeBtn :class="loading ? 'disabled opacity-50' : ''" @click="emits('toggle_fav',item.id)" v-model:value="item.is_like" />

        </div>
      <div v-if="isOpen" class="pt-2">
        <a  class="text-base leading-[130%] tracking-[-0.01em] underline text-[#3333e8]">
          {{item.text_en}}
        </a>
      </div>
    </div>
</template>