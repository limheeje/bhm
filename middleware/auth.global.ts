export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const loginPages = ['/login']
  const isLoginPage = loginPages.includes(to.path)

  if (to.path === '/') {
    return navigateTo('/login')
  }

  if (isLoginPage && authStore.isLoggedIn) {
    return navigateTo('/dashboard')
  }

  if (!isLoginPage && !authStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
