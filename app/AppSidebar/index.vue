<script setup lang="ts">
import './index.style.scss'
import {useRoute} from 'vue-router'
import AppIcon from '../AppIcon/index.vue'
import {BsBadge, BsAvatar} from '../../components/common/'
import {NAV, type NavItem} from '../data'

const route = useRoute()

// 하위 메뉴(children)를 가진 항목은 부모 링크의 `to`가 첫 번째 자식 경로로 고정돼 있어서,
// NuxtLink 기본 exact-active만으로는 "부위"/"실시간현황"처럼 다른 자식 경로에 있을 때 부모가 활성화되지 않음.
// → 현재 경로가 이 섹션의 자식 경로들 중 하나에 속하는지 직접 판단
function isSectionActive(item: NavItem): boolean {
  if (!item.children?.length) return false
  return item.children.some((child) => route.path === child.to || route.path.startsWith(`${child.to}/`))
}

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

const authStore = useAuthStore()
const favoriteStore = useFavoritesStore()
onMounted(async () => {
  await favoriteStore.fetchCount()
})
</script>

<template>
  <aside class="app-sidebar">
    <div class="app-sidebar__brand">
      <img class="app-sidebar__brand-full" :src="logoFull" height="22" alt="Lumo" />
      <img class="app-sidebar__brand-mark" :src="logoMark" width="26" height="26" alt="Lumo" />
    </div>

    <nav class="app-sidebar__nav">
      <div class="app-sidebar__section">메뉴</div>
      <template v-for="n in NAV" :key="n.key">
        <NuxtLink v-if="n.to" :to="n.to" class="app-sidebar__link">
          <span class="app-sidebar__link-icon"><AppIcon :name="n.icon" /></span>
          <span class="app-sidebar__link-label">{{ n.label }}</span>
          <BsBadge v-if="n.badge" tone="neutral">{{ favoriteStore.totalCount }}</BsBadge>
        </NuxtLink>

        <template v-else-if="n.children">
          <NuxtLink
            :to="n.children[0].to"
            class="app-sidebar__link"
            :class="{'router-link-exact-active': isSectionActive(n)}"
          >
            <span class="app-sidebar__link-icon"><AppIcon :name="n.icon" /></span>
            <span class="app-sidebar__link-label">{{ n.label }}</span>
          </NuxtLink>
          <NuxtLink
            v-for="child in n.children"
            :key="child.key"
            :to="child.to"
            class="app-sidebar__link app-sidebar__link--sub"
          >
            <span class="app-sidebar__link-label">{{ child.label }}</span>
          </NuxtLink>
        </template>
      </template>
    </nav>

    <div class="app-sidebar__footer">
      <div class="app-sidebar__user">
        <BsAvatar :name="authStore.managerName" :size="'sm'" status="online" />
        <div class="app-sidebar__user-meta">
          <div class="app-sidebar__user-name">{{ authStore.orgNm }}</div>
          <div class="app-sidebar__user-role">{{ authStore.managerName }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>
