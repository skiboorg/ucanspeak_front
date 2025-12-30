<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  data: {
    video_src: string
    phrases: {
      id: number
      start_time: string
      end_time: string
      text_en: string
      text_ru: string
      sound: string
    }[]
  }
}>()

/* DOM */
const playerEl = ref<HTMLElement | null>(null)
const videoEl = ref<HTMLVideoElement | null>(null)
const visible = ref<boolean>(false)

/* state */
const currentTime = ref(0)
const isFullscreen = ref(false)
const phrases = ref(props.data.phrases)

/* utils */
const parseTime = (time: string): number => {
  const [hh, mm, ss] = time.split('.').map(Number)
  return hh * 3600 + mm * 60 + ss
}

/* events */
const onTimeUpdate = () => {
  if (videoEl.value) currentTime.value = videoEl.value.currentTime
}

/* fullscreen */
const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

const toggleFullscreen = () => {
  if (!playerEl.value) return

  if (!document.fullscreenElement) {
    playerEl.value.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

/* computed */
const currentPhrase = computed(() =>
    phrases.value.find(p => {
      const start = parseTime(p.start_time)
      const end = parseTime(p.end_time)
      return currentTime.value >= start && currentTime.value <= end
    })
)

const visiblePhrases = computed(() =>
    phrases.value.filter(p =>
        parseTime(p.start_time) <= currentTime.value
    )
)

/* actions */
const jumpTo = (time: string) => {
  if (!videoEl.value) return
  videoEl.value.currentTime = parseTime(time)
  videoEl.value.play()
}

const playPhraseAudio = (file: string) => {
  new Audio(`https://platform.ucanspeak.ru${file}`).play()
}
</script>

<template>
  <img @click="visible = true" class="w-[120px] h-[90px] object-cover cursor-pointer" src="~assets/images/video_lesson.svg">
  <Dialog v-model:visible="visible" modal header="Видео урок" class="w-[80%]">
  <div
      ref="playerEl"
      class="relative   rounded-xl overflow-hidden"
  >

    <!-- VIDEO -->
    <video
        ref="videoEl"
        controls
        controlsList="nofullscreen"
        class="w-full"
        @timeupdate="onTimeUpdate"
    >
      <source
          :src="`https://platform.ucanspeak.ru${data.video_src}`"
          type="video/mp4"
      />
    </video>

    <!-- FULLSCREEN BUTTON -->
    <button
        class="absolute top-4 right-4 z-50 text-white bg-black/70 px-3 py-1 rounded"
        @click="toggleFullscreen"
    >
      ⛶
    </button>

    <!-- SUBTITLES (ALWAYS OVER VIDEO) -->
    <transition name="fade">
      <div
          v-if="isFullscreen && currentPhrase"
          class="absolute bottom-10 left-1/2 -translate-x-1/2
               z-40 bg-black/70 px-6 py-3 rounded-xl
               text-center max-w-[90%]"
      >
        <div class="text-2xl text-white font-bold">
          {{ currentPhrase.text_en }}
        </div>
        <div class="text-lg text-yellow-300 mt-1">
          {{ currentPhrase.text_ru }}
        </div>
      </div>
    </transition>

    <!-- PHRASES LIST (HIDDEN IN FULLSCREEN) -->
    <transition-group
        v-if="!isFullscreen"
        name="fade"
        tag="div"
        class=" bottom-0 left-0 right-0
             p-4 space-y-2 flex flex-col
             "
    >
      <div
          v-for="p in visiblePhrases"
          :key="p.id"
          class="p-2 rounded flex items-center justify-between"
          :class="{
      'bg-primary text-white': currentPhrase?.id === p.id,
      'bg-grey-300': currentPhrase?.id !== p.id
        }"
      >
        <div @click="jumpTo(p.start_time)" class="flex-1 cursor-pointer">
          <div class="font-semibold">{{ p.text_en }}</div>
          <div class="text-sm text-gray-300">{{ p.text_ru }}</div>
        </div>

        <button
            class="ml-2 px-2 py-1 bg-gray-600 rounded hover:bg-gray-400"
            @click.stop="playPhraseAudio(p.sound)"
        >
          ▶️
        </button>
      </div>
    </transition-group>

  </div>
  </Dialog>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>



<!--<script setup lang="ts">-->
<!--import { ref, computed, onMounted } from 'vue'-->

<!--const props = defineProps<{-->
<!--  data: {-->
<!--    video_src: string-->
<!--    phrases: any[]-->
<!--  }-->
<!--}>()-->

<!--const videoEl = ref<HTMLVideoElement | null>(null)-->
<!--const currentTime = ref(0)-->
<!--const phrases = ref<any[]>([])-->
<!--const translationVisible = ref(false)-->
<!--const showTranslationOnClick = ref(true)-->

<!--const phraseAudio = new Audio()-->

<!--// 🔹 парсим "00.00.43" → 43-->
<!--const parseTime = (time: string): number => {-->
<!--  const [hh, mm, ss] = time.split('.').map(Number)-->
<!--  return hh * 3600 + mm * 60 + ss-->
<!--}-->

<!--onMounted(() => {-->
<!--  // можно оставить строки, парсим на лету-->
<!--  phrases.value = props.data.phrases-->
<!--})-->

<!--const onTimeUpdate = () => {-->
<!--  if (!videoEl.value) return-->
<!--  currentTime.value = videoEl.value.currentTime-->
<!--}-->

<!--// 🔹 текущая фраза-->
<!--const currentPhrase = computed(() =>-->
<!--    phrases.value.find(p => {-->
<!--      const start = parseTime(p.start_time)-->
<!--      const end = parseTime(p.end_time)-->
<!--      return currentTime.value >= start && currentTime.value <= end-->
<!--    })-->
<!--)-->

<!--// 🔹 уже пройденные фразы-->
<!--const visiblePhrases = computed(() =>-->
<!--    phrases.value.filter(p =>-->
<!--        parseTime(p.start_time) <= currentTime.value-->
<!--    )-->
<!--)-->

<!--const toggleTranslation = () => {-->
<!--  if (showTranslationOnClick.value) {-->
<!--    translationVisible.value = !translationVisible.value-->
<!--  }-->
<!--}-->

<!--const shouldShowTranslation = computed(() =>-->
<!--    showTranslationOnClick.value ? translationVisible.value : !!currentPhrase.value-->
<!--)-->

<!--// 🔹 прыжок по клику-->
<!--const jumpTo = (time: string) => {-->
<!--  if (!videoEl.value) return-->
<!--  videoEl.value.currentTime = parseTime(time)-->
<!--  videoEl.value.play()-->
<!--}-->

<!--const playPhraseAudio = (file: string) => {-->
<!--  phraseAudio.src = `https://platform.ucanspeak.ru${file}`-->
<!--  phraseAudio.play()-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <div class="player relative  p-4 rounded-xl">-->

<!--    &lt;!&ndash; Видео &ndash;&gt;-->
<!--    <video-->
<!--        ref="videoEl"-->
<!--        controls-->
<!--        class="w-full mb-6 rounded"-->
<!--        @timeupdate="onTimeUpdate"-->
<!--    >-->
<!--      <source-->
<!--          :src="`https://platform.ucanspeak.ru${data.video_src}`"-->
<!--          type="video/mp4"-->
<!--      />-->
<!--    </video>-->

<!--    &lt;!&ndash; Текущая фраза &ndash;&gt;-->
<!--    <transition name="fade">-->
<!--      <div-->
<!--          v-if="currentPhrase"-->
<!--          class="text-center text-2xl font-bold mb-2 cursor-pointer"-->
<!--          @click="toggleTranslation"-->
<!--      >-->
<!--        {{ currentPhrase.text_en }}-->
<!--      </div>-->
<!--    </transition>-->

<!--    &lt;!&ndash; Перевод &ndash;&gt;-->
<!--    <transition name="fade">-->
<!--      <div-->
<!--          v-if="shouldShowTranslation && currentPhrase"-->
<!--          class="text-center text-lg text-yellow-300"-->
<!--      >-->
<!--        {{ currentPhrase.text_ru }}-->
<!--      </div>-->
<!--    </transition>-->

<!--    &lt;!&ndash; Список фраз &ndash;&gt;-->
<!--    <transition-group-->
<!--        name="fade"-->
<!--        tag="div"-->
<!--        class="mt-6 space-y-2 flex flex-col"-->
<!--    >-->
<!--      <div-->
<!--          v-for="p in visiblePhrases"-->
<!--          :key="p.id"-->
<!--          class="p-2 rounded cursor-pointer flex items-center justify-between"-->
<!--          :class="{-->
<!--      'bg-primary text-white': currentPhrase?.id === p.id,-->
<!--      'bg-grey-300': currentPhrase?.id !== p.id-->
<!--    }"-->
<!--      >-->
<!--        <div @click="jumpTo(p.start_time)" class="flex-1">-->
<!--          <div class="font-semibold">{{ p.text_en }}</div>-->
<!--          <div class="text-sm text-gray-300">{{ p.text_ru }}</div>-->
<!--        </div>-->

<!--        <button-->
<!--            class="ml-2 px-2 py-1 bg-gray-600 rounded hover:bg-gray-400"-->
<!--            @click.stop="playPhraseAudio(p.sound)"-->
<!--        >-->
<!--          ▶️-->
<!--        </button>-->
<!--      </div>-->
<!--    </transition-group>-->

<!--  </div>-->
<!--</template>-->


<!--<style>-->
<!--.fade-enter-active,-->
<!--.fade-leave-active {-->
<!--  transition: opacity 0.4s ease;-->
<!--}-->
<!--.fade-enter-from,-->
<!--.fade-leave-to {-->
<!--  opacity: 0;-->
<!--}-->
<!--</style>-->