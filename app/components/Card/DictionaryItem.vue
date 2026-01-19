<script setup lang="ts">
const audio = new Audio()

const props = defineProps(['item', 'loading','dictionary_direction','opened'])

const emits = defineEmits(['toggle_fav','toggle_open'])
const checked = ref(false)
const play = () => {
  audio.src = props.item.file
  audio.play()
}
</script>


<template>
  <div class="">
    <div class="relative inline-flex items-start gap-4 " :class="opened ? 'h-[85px]' : 'h-auto'">
  <Checkbox  v-model="checked" binary/>
    <div class="bg-[#EFEFF5] hover:bg-[#e9e9e9] overflow-hidden p-2.5 rounded-lg">
        <div @click="emits('toggle_open', item.id)" class="flex items-center  select-none gap-3">
            <div @click="play" class="flex flex-grow items-center gap-[3px] cursor-pointer">
                <div class="text-base leading-[130%]">
                    <span v-if="opened">{{dictionary_direction === 'ruEN' ?  item.text_ru :item.text_en}}</span>
                    <span v-else>{{dictionary_direction === 'ruEN' ?  item.text_ru :item.text_en}}</span>
                </div>
            </div>
            <UILikeBtn :class="loading ? 'disabled opacity-50' : ''"  @click.stop="emits('toggle_fav',item.id)" v-model:value="item.is_favorite" />
        </div>
      <div v-if="opened" class="right-0 bottom-0 absolute bg-[#7575F0] p-2.5 rounded-lg inline-block">
        <p  class="text-base text-right leading-[130%] tracking-[-0.01em] text-white">
          {{dictionary_direction === 'ruEN' ?  item.text_en :item.text_ru}}
        </p>
      </div>
    </div>
    </div>
  </div>
</template>