<script setup lang="ts">
import '~/app/shared.scss'
import './index.style.scss'
import {useRoute} from 'vue-router'
import {computed, ref} from 'vue'
import {BsButton, BsCard, BsBadge, BsPagination, BsModal} from '~/components/common'
import AppIcon from '~/app/AppIcon/index.vue'
import {formatDate, NOTICE_TYPE_LABEL} from '~/app/data'
import type {PaginationResponse, SingleResponse} from '~/types/commonResponse'
import type {getNoticeResponse, getNoticesDetailParams, getNoticesDetailResponse} from '~/composables/useNoticeApi'

const api = useNoticeApi()
const route = useRoute()
const query = route.query
const toast = useToast()
const localDetailItem = ref<getNoticesDetailResponse | null>(null)
const pageInfo = reactive({
  page: 1,
  size: 5
})
const {
  data: resNotices,
  pending: resNoticesPending,
  error: resNoticesError
} = await useAsyncData(
  'pages-notices',
  async () => {
    const res = await api.getNotices<PaginationResponse<getNoticeResponse>>({
      ...pageInfo,
      page: pageInfo.page - 1
    })
    return {
      data: res?.data,
      pageParams: res?.pageInfo
    }
  },
  {
    watch: [pageInfo]
  }
)
const sortedResNoticesData = computed(() => {
  const _item = (resNotices.value?.data as getNoticeResponse[]) || []
  return [..._item].sort((a, b) => {
    if (a.pinYn !== b.pinYn) return a.pinYn === 'Y' ? -1 : 1
    return b.regDt.localeCompare(a.regDt)
  })
})

onMounted(() => {
  if (query.ntceNo) {
    open(Number(query.ntceNo))
  }
})

async function open(no: number) {
  const res = await getNoticesDetail({
    ntceNo: no
  })
  console.log('getNoticesDetail---', res)

  if (res?.success) {
    localDetailItem.value = res.data
  } else {
    toast.open({
      tone: (t) => t.DANGER,
      title: 'Error',
      message: '목록을 불러올수없습니다.'
    })
    close()
  }
}

function close() {
  localDetailItem.value = null
}

async function getNoticesDetail(params: getNoticesDetailParams) {
  return await api.getNoticesDetail<SingleResponse<getNoticesDetailResponse>>(params)
}
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
        <template v-if="resNoticesPending"> 처리중. 스켈레톤 </template>
        <template v-else-if="resNoticesError"> 목로불러오기 실패 </template>
        <template v-else>
          <button
            v-for="(item, index) in sortedResNoticesData"
            :key="index"
            class="notice__row"
            @click="open(item.ntceNo)"
          >
            <BsBadge v-if="item.pinYn === 'Y'" tone="brand" size="sm">
              <AppIcon name="pin" :size="11" :stroke="2" /> 고정
            </BsBadge>
            <span class="notice__title" :class="{'notice__title--pinned': item.pinYn === 'Y'}">{{ item.title }}</span>
            <span class="notice__date">{{ formatDate(item.regDt) }}</span>
            <span class="notice__chev"><AppIcon name="chevronRight" :size="16" /></span>
          </button>
          <div style="margin-top: 15px; display: flex; justify-content: center">
            <BsPagination v-model="pageInfo.page" :total="resNotices?.pageParams?.totalPages" />
          </div>
        </template>
      </div>
    </BsCard>

    <BsModal :model-value="!!localDetailItem" size="lg" :title="localDetailItem?.title" @update:model-value="close">
      <template v-if="localDetailItem">
        <div class="notice__detail-meta">
          <BsBadge :tone="localDetailItem.ntceType === 'SYSTEM' ? 'warning' : 'neutral'" size="sm">
            {{ NOTICE_TYPE_LABEL[localDetailItem.ntceType] ?? localDetailItem.ntceType }}
          </BsBadge>
          <BsBadge v-if="localDetailItem.pinYn === 'Y'" tone="brand" size="sm">고정</BsBadge>
          <span class="notice__detail-date"
            >{{ localDetailItem.regNm }} · {{ formatDate(localDetailItem.regDt, true) }}</span
          >
        </div>
        <div class="notice__detail-body">{{ localDetailItem.content }}</div>
      </template>
      <template #footer>
        <BsButton variant="secondary" @click="close">닫기</BsButton>
      </template>
    </BsModal>
  </div>
</template>
