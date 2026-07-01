<script setup lang="ts">
import './default.style.scss'
import {computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import AppSidebar from '~/app/AppSidebar/index.vue'
import AppTopbar from '~/app/AppTopbar/index.vue'
import {BsToastProvider, BsModalProvider} from '~/components/common'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const TITLES: Record<string, string> = {
  '/dealer/dashboard': '대시보드',
  '/users': '사용자',
  '/orders': '주문',
  '/analytics': '분석',
  '/settings': '설정'
}
const title = computed(() => TITLES[route.path] ?? '대시보드')

async function logout() {
  const res = await useLoginApi.logout()
  console.log('res---', res)

  if (res.success) {
    authStore.setLogout()
    router.push('/login')
  }
}
</script>

<template>
  <BsToastProvider>
    <BsModalProvider>
      <div class="app-shell">
        <AppSidebar />
        <div class="app-shell__main">
          <AppTopbar :title="title" @logout="logout" />
          <main class="app-shell__content">
            <slot />
          </main>
        </div>
      </div>
    </BsModalProvider>
  </BsToastProvider>
</template>
