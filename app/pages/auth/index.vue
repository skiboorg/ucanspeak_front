<script setup lang="ts">
const current_form = ref('login')
const changeFormHandler = (form:string) => {
  current_form.value = form
}
</script>

<template>
  <div class="container h-screen flex flex-col items-start justify-center w-screen">
    <TypingText48 :text="current_form === 'login' ? 'Вход на сайт' : 'Регистрация аккаунта'" class="mb-8"/>
    <FormLogin v-if="current_form==='login'" @change_form="changeFormHandler"/>
    <FormRegister v-if="current_form==='register'" @change_form="changeFormHandler"/>
  </div>
</template>
