<script setup lang="ts">
const showNotAuthModal = useState('showNotAuthModal')
</script>

<template>
  <Dialog v-model:visible="showNotAuthModal" modal header="Это платный урок" class="w-[90%] md:w-[50%]">

      <p class="pb-4">Зарегистрируйтесь и бесплатно получите демодоступ на платформу на 3 дня с момента регистрации.</p>
    <div class="flex flex-col justify-end gap-2">

      <Button fluid @click="navigateTo('/auth?form=register')" type="button" label="Зарегистрироваться"/>
      <Button fluid  @click="navigateTo('/auth?form=login')" outlined type="button" label="Войти"/>
    </div>
  </Dialog>
</template>

<style scoped>

</style>