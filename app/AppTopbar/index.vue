<script setup lang="ts">
import './index.style.scss'
import {ref} from 'vue'
import AppIcon from '../AppIcon/index.vue'
import {BsIconButton, BsButton} from '../../components/common'

defineProps<{title: string}>()
const emit = defineEmits<{(e: 'logout'): void}>()

const q = ref('')
const dark = ref(false)

function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.dataset.theme = dark.value ? 'dark' : ''
}
</script>

<template>
  <header class="app-topbar">
    <h1 class="app-topbar__title">{{ title }}</h1>

    <div class="app-topbar__search">
      <div class="app-topbar__search-box">
        <span class="app-topbar__search-icon"><AppIcon name="search" :size="16" /></span>
        <input v-model="q" class="app-topbar__search-input" placeholder="검색…" />
        <kbd class="app-topbar__search-kbd">⌘K</kbd>
      </div>
    </div>

    <div class="app-topbar__spacer" />

    <BsIconButton :aria-label="dark ? '라이트 모드' : '다크 모드'" variant="secondary" @click="toggleTheme">
      <AppIcon :name="dark ? 'sun' : 'moon'" :size="17" />
    </BsIconButton>

    <button class="app-topbar__bell" aria-label="알림">
      <AppIcon name="bell" />
      <span class="app-topbar__bell-dot" />
    </button>

    <BsButton variant="ghost" size="sm" @click="emit('logout')">
      <template #lead><AppIcon name="logout" :size="16" /></template>
      로그아웃
    </BsButton>
  </header>
</template>
