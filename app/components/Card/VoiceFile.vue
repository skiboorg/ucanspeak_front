<script setup lang="ts">
const audio = new Audio()

const props = defineProps(['item','is_trainer'])
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
          <Button @click="play" severity="contrast" class="bg-[#efeff5] !w-10 !h-10 rounded-full shrink-0 p-0 flex items-center justify-center">
            <svg v-if="isPlay" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18.4V5.6C6 5.44087 6.06321 5.28826 6.17574 5.17574C6.28826 5.06321 6.44087 5 6.6 5H9.4C9.55913 5 9.71174 5.06321 9.82426 5.17574C9.93679 5.28826 10 5.44087 10 5.6V18.4C10 18.5591 9.93679 18.7117 9.82426 18.8243C9.71174 18.9368 9.55913 19 9.4 19H6.6C6.44087 19 6.28826 18.9368 6.17574 18.8243C6.06321 18.7117 6 18.5591 6 18.4ZM14 18.4V5.6C14 5.44087 14.0632 5.28826 14.1757 5.17574C14.2883 5.06321 14.4409 5 14.6 5H17.4C17.5591 5 17.7117 5.06321 17.8243 5.17574C17.9368 5.28826 18 5.44087 18 5.6V18.4C18 18.5591 17.9368 18.7117 17.8243 18.8243C17.7117 18.9368 17.5591 19 17.4 19H14.6C14.4409 19 14.2883 18.9368 14.1757 18.8243C14.0632 18.7117 14 18.5591 14 18.4Z" fill="#3333E8" stroke="#3333E8" stroke-width="1.5" />
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.86172 5.2C9.71315 5.08857 9.53649 5.02072 9.35152 5.00404C9.16656 4.98736 8.98061 5.02252 8.81451 5.10557C8.6484 5.18863 8.5087 5.31629 8.41107 5.47427C8.31343 5.63225 8.26172 5.81429 8.26172 6V18C8.26172 18.1857 8.31343 18.3678 8.41107 18.5257C8.5087 18.6837 8.6484 18.8114 8.81451 18.8944C8.98061 18.9775 9.16656 19.0126 9.35152 18.996C9.53649 18.9793 9.71315 18.9114 9.86172 18.8L17.8617 12.8C17.9859 12.7069 18.0867 12.5861 18.1561 12.4472C18.2256 12.3084 18.2617 12.1552 18.2617 12C18.2617 11.8448 18.2256 11.6916 18.1561 11.5528C18.0867 11.4139 17.9859 11.2931 17.8617 11.2L9.86172 5.2Z" fill="#3333E8" />
            </svg>
          </Button>
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
            <UILikeBtn @click="emits('toggle_fav',item.id)" v-model:value="item.is_like" />

        </div>
      <div v-if="isOpen" class="pt-2">
        <a  class="text-base leading-[130%] tracking-[-0.01em] underline text-[#3333e8]">
          {{item.text_en}}
        </a>
      </div>
    </div>
</template>