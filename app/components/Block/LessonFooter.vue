<script setup lang="ts">
type ViewMode = "module" | "videos" | "audio" | "trainer"

const emits = defineEmits(['mode_change'])

const handleClick = (mode) => {
  emits('mode_change',mode)
}
</script>

<template>
<footer class="block md:hidden">
  <div class="fixed left-0 bottom-0 w-full h-[70px] bg-white pt-3 flex items-center justify-evenly z-50">
    <div @click="handleClick('audio')" class="footer-link flex flex-col items-center justify-center gap-1" >
      <svg  width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8656 13.2C17.7171 13.0886 17.5404 13.0207 17.3554 13.004C17.1705 12.9874 16.9845 13.0225 16.8184 13.1056C16.6523 13.1886 16.5126 13.3163 16.415 13.4743C16.3173 13.6322 16.2656 13.8143 16.2656 14V26C16.2656 26.1857 16.3173 26.3678 16.415 26.5257C16.5126 26.6837 16.6523 26.8114 16.8184 26.8944C16.9845 26.9775 17.1705 27.0126 17.3554 26.996C17.5404 26.9793 17.7171 26.9114 17.8656 26.8L25.8656 20.8C25.9898 20.7069 26.0906 20.5861 26.1601 20.4472C26.2295 20.3084 26.2656 20.1552 26.2656 20C26.2656 19.8448 26.2295 19.6916 26.1601 19.5528C26.0906 19.4139 25.9898 19.2931 25.8656 19.2L17.8656 13.2Z" fill="#3333E8"/>
      </svg>
      <p>Аудиоурок</p>
    </div>
    <div @click="handleClick('table')" class="footer-link flex flex-col items-center justify-center gap-1" >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
        <path d="M13 12H27C27.5304 12 28.0391 12.2107 28.4142 12.5858C28.7893 12.9609 29 13.4696 29 14V26C29 26.5304 28.7893 27.0391 28.4142 27.4142C28.0391 27.7893 27.5304 28 27 28H13C12.4696 28 11.9609 27.7893 11.5858 27.4142C11.2107 27.0391 11 26.5304 11 26V14C11 13.4696 11.2107 12.9609 11.5858 12.5858C11.9609 12.2107 12.4696 12 13 12ZM13 16V20H19V16H13ZM21 16V20H27V16H21ZM13 22V26H19V22H13ZM21 22V26H27V22H21Z" fill="#3333E8"/>
      </svg>
      <p>Таблица</p>
    </div>

    <div @click="handleClick('videos')" class="footer-link flex flex-col items-center justify-center gap-1" >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
        <path d="M10 13C10 12.7348 10.1054 12.4804 10.2929 12.2929C10.4804 12.1054 10.7348 12 11 12H29C29.2652 12 29.5196 12.1054 29.7071 12.2929C29.8946 12.4804 30 12.7348 30 13V27C30 27.2652 29.8946 27.5196 29.7071 27.7071C29.5196 27.8946 29.2652 28 29 28H11C10.7348 28 10.4804 27.8946 10.2929 27.7071C10.1054 27.5196 10 27.2652 10 27V13Z" stroke="#3333E8" stroke-width="2" stroke-linejoin="round"/>
        <path d="M26 12V28M14 12V28M27 17H30M27 23H30M10 17H13M10 16V18M12.5 12H15.5M12.5 28H15.5M24.5 12H27.5M24.5 28H27.5M10 23H13M10 22V24M30 22V24M30 16V18" stroke="#3333E8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.5 17.5L22.5 20L18.5 22.5V17.5Z" stroke="#3333E8" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      <p>Видео</p>
    </div>
    <div @click="handleClick('trainer')" class="footer-link flex flex-col items-center justify-center gap-1" >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#EFEFF5"/>
        <path d="M20.573 28.6957H25.2174C25.6786 28.6957 26.121 28.5124 26.4471 28.1863C26.7733 27.8601 26.9565 27.4178 26.9565 26.9565V16.5217C26.9572 16.2462 26.9033 15.9732 26.7979 15.7186C26.6926 15.464 26.5378 15.2328 26.3426 15.0383L23.2226 11.9183C23.0281 11.7231 22.7969 11.5683 22.5423 11.4629C22.2877 11.3576 22.0147 11.3037 21.7391 11.3044H14.7826C14.3214 11.3044 13.879 11.4876 13.5529 11.8137C13.2267 12.1399 13.0435 12.5822 13.0435 13.0435V21.1652" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21.74 11.3043V15.6522C21.74 15.8828 21.8316 16.104 21.9947 16.267C22.1578 16.4301 22.3789 16.5217 22.6096 16.5217H26.9574M18.5904 20.5409C18.9367 20.1949 19.4062 20.0007 19.8957 20.001C20.3852 20.0012 20.8545 20.1959 21.2004 20.5422C21.5464 20.8885 21.7406 21.358 21.7403 21.8474C21.7401 22.3369 21.5454 22.8062 21.1991 23.1522L16.8357 27.5104C16.629 27.7172 16.3736 27.8685 16.093 27.9504L13.6 28.6783C13.5252 28.7001 13.4459 28.7014 13.3704 28.682C13.2949 28.6627 13.2259 28.6234 13.1708 28.5683C13.1157 28.5132 13.0764 28.4443 13.0571 28.3688C13.0377 28.2933 13.039 28.214 13.0609 28.1391L13.7878 25.6443C13.8699 25.3641 14.0212 25.109 14.2278 24.9026L18.5904 20.5409Z" stroke="#3333E8" stroke-width="1.73913" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <p>Орфография</p>
    </div>
  </div>
</footer>
</template>

<style lang="sass">
.footer-link
  color: #777788
  p
    font-size: 11px
  svg
    path
      fill: #8F8FA3
  &.active
    color: #3333E8
    svg
      path
        fill: #3333E8
</style>