<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {BsCard, BsBadge, BsModal, BsButton} from '../../components/common'
import AppIcon from '../../app/AppIcon/index.vue'
import {NOTICES, NOTICE_DETAILS, NOTICE_TYPE_LABEL, formatDate, type NoticeDetail} from '../../app/data'

const route = useRoute()

// 고정 공지 먼저
const sorted = computed(() =>
  [...NOTICES].sort((a, b) => {
    if (a.pinYn !== b.pinYn) return a.pinYn === 'Y' ? -1 : 1
    return b.regDt.localeCompare(a.regDt)
  })
)

const detail = ref<NoticeDetail | null>(null)
function open(no: number) {
  detail.value = NOTICE_DETAILS[no] ?? null
}
function close() {
  detail.value = null
}

// 대시보드에서 ?no=1 로 진입 시 바로 상세 열기
onMounted(() => {
  const no = Number(route.query.no)
  if (no) open(no)
})
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">공지사항</h2>
        <p class="pg__sub">경매 일정과 시스템 안내를 확인하세요</p>
      </div>
    </div>

    <BsCard padding="sm">
      <div class="notice__list">
        <button v-for="n in sorted" :key="n.ntceNo" class="notice__row" @click="open(n.ntceNo)">
          <BsBadge v-if="n.pinYn === 'Y'" tone="brand" size="sm">
            <AppIcon name="pin" :size="11" :stroke="2" /> 고정
          </BsBadge>
          <span class="notice__title" :class="{'notice__title--pinned': n.pinYn === 'Y'}">{{ n.title }}</span>
          <span class="notice__date">{{ formatDate(n.regDt) }}</span>
          <span class="notice__chev"><AppIcon name="chevronRight" :size="16" /></span>
        </button>
      </div>
    </BsCard>

    <BsModal :model-value="!!detail" size="lg" :title="detail?.title" @update:model-value="close">
      <template v-if="detail">
        <div class="notice__detail-meta">
          <BsBadge :tone="detail.ntceType === 'SYSTEM' ? 'warning' : 'neutral'" size="sm">
            {{ NOTICE_TYPE_LABEL[detail.ntceType] ?? detail.ntceType }}
          </BsBadge>
          <BsBadge v-if="detail.pinYn === 'Y'" tone="brand" size="sm">고정</BsBadge>
          <span class="notice__detail-date">{{ detail.regNm }} · {{ formatDate(detail.regDt, true) }}</span>
        </div>
        <div class="notice__detail-body">{{ detail.content }}</div>
      </template>
      <template #footer>
        <BsButton variant="secondary" @click="close">닫기</BsButton>
      </template>
    </BsModal>
  </div>
</template>
