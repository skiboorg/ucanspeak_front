export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(to);
  if (to.fullPath==='/') return navigateTo({ name: 'courses' })

  const authStore = useAuthStore()
  const {user} = storeToRefs(authStore)

  if (user.value && user.value.is_subscription_expired && to.name !== 'tariff') {
    return  navigateTo({ name: 'tariff' })
  }

  if(to.meta.auth || to.meta.guest){
    if(to.meta.auth && !authStore.user){
      return navigateTo({ name: 'courses' })
    }
    else if(to.meta.guest && authStore.user){
      return navigateTo({ name: 'courses' })
    }
  }
})
