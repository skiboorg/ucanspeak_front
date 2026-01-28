export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  const {user} = storeToRefs(authStore)

  if (user.value && user.value.is_subscription_expired && to.name !== 'tariff') {
    return  navigateTo({ name: 'tariff' })
  }

  if(to.meta.auth || to.meta.guest){
    if(to.meta.auth && !authStore.user){
      return navigateTo({ name: 'index' })
    }
    else if(to.meta.guest && authStore.user){
      return navigateTo({ name: 'courses' })
    }
  }
})
