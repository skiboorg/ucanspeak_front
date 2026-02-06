<script setup lang="ts">
definePageMeta({
  guest: true,
  layout: 'default'
})
navigateTo('/courses')
</script>
<template>
<div class="container">

  <nuxt-link to="/auth">auth</nuxt-link>
</div>
</template>