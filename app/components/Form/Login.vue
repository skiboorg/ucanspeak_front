<script setup lang="ts">
const emits = defineEmits(['change_form'])
import { useToast } from 'primevue/usetoast';
const toast = useToast()
const {$api} = useNuxtApp()
const loading = ref(false)

const form_data = ref({
  login:'',
  password:'',
})

watch(
    () => form_data.value.login,
    (newEmail) => {
      form_data.value.login = newEmail.toLowerCase()
    }
)

const login = async () => {
  loading.value = true
  try{
    const response = await $api.auth.login(form_data.value)
    const authCookie = useCookie('auth_token',{
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    })
    const { authToken } = useAuthToken()
    authCookie.value = response.auth_token
    //authToken.value = response.auth_token
    window.location.reload()
    toast.add({ severity: 'success',summary:'Успешно', detail: 'Получение данных пользователя...', life: 3000 });
  }catch(error){

    toast.add({ severity: 'error',summary:'Ошибка', detail: error.data.non_field_errors[0], life: 3000 });
  }
  finally {
    loading.value = false
  }

}
</script>

<template>
<CardBase padding="none" extra-class="w-full px-3 lg:px-[240px]">
  <div class="flex flex-col items-center justify-center py-10 md:p-[60px] w-full">
    <div class="space-y-3 w-full mb-8">
      <TypingText20 text="Введите данные для входа"/>
      <UIInput fluid
               placeholder="Введите адрес почты или телефон"
               label="Email/Логин"
               id="email"
               v-model="form_data.login"/>
      <UIInput fluid
               placeholder="Введите пароль"
               label="Пароль"
               id="password"
               v-model="form_data.password"/>
    </div>
    <Button fluid
            class="mb-8"
            @click="login"
            :loading="loading"
            label="Войти" />
    <p>
      У вас нет аккаунта?
      <UILink label="Зарегистрируйтесь"
              link="#"
              @click.prevent="emits('change_form','register')"/>
      на нашей платформе и получите 7 дней пробного доступа ко всем урокам и разделам!
    </p>
  </div>
</CardBase>
</template>

<style scoped>

</style>