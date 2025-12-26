<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

const {$api} = useNuxtApp()
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
const selectedFile = ref(null)
const fileInput = ref(null)
const avatarPreview = ref(null)
const toast = useToast()

const user_data = ref({
  email: user.value.email,
  phone: user.value.phone || null,
  full_name: user.value.full_name || null,
  password: '',
  password1: '',
})

const avatarLabel = computed(() => {
  if (user.value?.full_name) {
    const names = user.value.full_name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`
    }
    return user.value.full_name[0]
  }
  return 'U'
})

const onFileSelected = (event) => {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file

  // Предпросмотр
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
  user_data.value.avatar = selectedFile.value

}

const { send, pending, errors } = useForm({
  apiFn: $api.auth.update,
  formData: user_data.value,
  asFormData: true,
  onSuccess: async ()=>{
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Профиль обновлен',
      life: 2000
    })
    await $api.auth.me()
  }
})
</script>

<template>
<CardBase padding="md">
  <TypingText28 text="Ваш профиль" class="mb-6"/>
  <TypingText18 text="Фото профиля" class="mb-3"/>
  <div class="flex items-center gap-10 mb-6">
    <Avatar
        :image="avatarPreview || user?.avatar"
        :label="avatarPreview || user?.avatar ? null : avatarLabel"
        size="xlarge"
        shape="circle"
        class="w-20 h-20 text-lg"
    />

      <Button
          label="Выбрать файл"
          icon="pi pi-image"
          @click="fileInput?.click()"
          />

    <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="onFileSelected"
        class="hidden"
    />


  </div>
  <div class="space-y-2 mb-3">
    <TypingText18 text="Личные данные" />
    <UIInput fluid
             placeholder="ФИО"
             label="ФИО"
             id="full_name"
             v-model="user_data.full_name"/>
    <UIInput fluid
             placeholder="Адрес почты "
             label="Email"
             id="email"
             v-model="user_data.email"/>
    <UIInput fluid
             placeholder="Телефон"
             label="Телефон"
             id="phone"
             v-model="user_data.phone"/>
    <TypingText18 text="Смена пароля" />
    <UIInput fluid
             placeholder="Новый пароль"
             label="Новый пароль"
             id="password"
             v-model="user_data.password"/>
    <UIInput fluid
             placeholder="Повторите пароль"
             label="Повторите пароль"
             id="password1"
             v-model="user_data.password1"/>
  </div>
  <div v-if="errors" class="text-red-500">
    {{errors}}
  </div>

  <Button severity="success" @click="send" :loading="pending" label="Обновить"/>

</CardBase>
</template>

<style scoped>

</style>