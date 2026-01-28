<script setup lang="ts">
const init_form = useRoute().query.form


const current_form = ref('login')
if (init_form) {
  current_form.value = init_form
}
const changeFormHandler = (form:string) => {
  current_form.value = form
}
</script>

<template>
  <div class="h-[calc(100vh-200px)] flex flex-col items-start justify-center">
    <TypingText48 :text="current_form === 'login' ? 'Вход на сайт' : 'Регистрация аккаунта'" class="mb-8"/>
    <FormLogin v-if="current_form==='login'" @change_form="changeFormHandler"/>
    <FormRegister v-if="current_form==='register'" @change_form="changeFormHandler"/>
  </div>
</template>
