<script setup lang="ts">
import './index.style.scss'
import AppIcon from '../AppIcon/index.vue'
import {BsBadge, BsAvatar} from '../../components/common/'
import {NAV} from '../data'

const logoFull =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="116" height="32" viewBox="0 0 116 32" fill="none">' +
      '<rect x="2" y="2" width="28" height="28" rx="8" fill="#2563d8"/><circle cx="16" cy="16" r="8" fill="#fff"/><circle cx="16" cy="16" r="3.5" fill="#2563d8"/>' +
      '<text x="42" y="22" font-family="Pretendard, system-ui, sans-serif" font-size="20" font-weight="700" letter-spacing="-0.02em" fill="#23252e">Lumo</text></svg>'
  )
const logoMark =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">' +
      '<rect x="2" y="2" width="28" height="28" rx="8" fill="#2563d8"/><circle cx="16" cy="16" r="8" fill="#fff"/><circle cx="16" cy="16" r="3.5" fill="#2563d8"/></svg>'
  )
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__brand">
      <img class="app-sidebar__brand-full" :src="logoFull" height="22" alt="Lumo" />
      <img class="app-sidebar__brand-mark" :src="logoMark" width="26" height="26" alt="Lumo" />
    </div>

    <nav class="app-sidebar__nav">
      <div class="app-sidebar__section">메뉴</div>
      <NuxtLink v-for="n in NAV" :key="n.key" :to="n.to" class="app-sidebar__link">
        <span class="app-sidebar__link-icon"><AppIcon :name="n.icon" /></span>
        <span class="app-sidebar__link-label">{{ n.label }}</span>
        <BsBadge v-if="n.badge" tone="neutral">{{ n.badge }}</BsBadge>
      </NuxtLink>
    </nav>

    <div class="app-sidebar__footer">
      <div class="app-sidebar__user">
        <BsAvatar name="정하준" :size="'sm'" status="online" />
        <div class="app-sidebar__user-meta">
          <div class="app-sidebar__user-name">정하준</div>
          <div class="app-sidebar__user-role">관리자</div>
        </div>
      </div>
    </div>
  </aside>
</template>
