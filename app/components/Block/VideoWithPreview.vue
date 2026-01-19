<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
const config = useRuntimeConfig();

const props = defineProps<{
  showPreview: boolean;
  data: {
    video_src: string
    file: string
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
const firstFrame = ref<string | null>(null) // здесь будет base64 первого кадра

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
  if(!props.showPreview) return
  document.addEventListener('fullscreenchange', onFullscreenChange)
  console.log(props.data.file)
  // --- получаем первый кадр ---
  const tempVideo = document.createElement('video')
  tempVideo.src = props.data.file
  tempVideo.crossOrigin = 'anonymous' // если видео с другого домена
  tempVideo.muted = true
  tempVideo.currentTime = 0
  tempVideo.addEventListener('loadeddata', () => {
    const canvas = document.createElement('canvas')
    canvas.width = tempVideo.videoWidth
    canvas.height = tempVideo.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height)
      firstFrame.value = canvas.toDataURL('image/png')
    }
  })
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
  new Audio(file).play()
}
const fav_loading = ref(false)
const openedId = ref<number | null>(null)
const handleToggleOpen = (id: number) => {
  openedId.value = openedId.value === id ? null : id
}
</script>

<template>

  <img
      v-if="showPreview && firstFrame"
      @click="visible = true"
      class="w-[220px] h-[140px] object-cover cursor-pointer"
      :src="firstFrame"
  />
  <img
      v-else
      @click="visible = true"
      class="w-[120px] h-[90px] object-cover cursor-pointer"
      src="~assets/images/video_lesson.svg"
  />

  <Dialog v-model:visible="visible" modal header="Видео урок" :show-header="false" class="w-[90%] lg:w-[65%] video-modal">
    <div ref="playerEl" class="relative rounded-xl overflow-hidden">
      <!-- VIDEO -->
      <video
          ref="videoEl"
          controls
          controlsList="nofullscreen"
          class="w-full"
          @timeupdate="onTimeUpdate"
      >

        <source :src="data.file+'#t=0.1'" type="video/mp4" />
      </video>
      <p class="bg-white absolute left-2 top-2 py-1 px-2 rounded-lg font-medium">{{data.video_number}}</p>
      <!-- FULLSCREEN BUTTON -->
      <button
          class="absolute top-2 right-2 z-50 text-white bg-black/70 px-3 py-1 rounded"
          @click="visible=false"
      >
        <i class="pi pi-times"></i>
      </button>
      <button
          class="absolute top-2 right-14 z-50 text-white bg-black/70 px-3 py-1 rounded"
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

        <CardVoiceFile
            v-for="item in visiblePhrases"
            :key="item.id"
            :item="item"
            :opened="openedId === item.id"
            :loading="fav_loading"
            @toggle_open="handleToggleOpen"

        />

      </transition-group>
    </div>
  </Dialog>
</template>
