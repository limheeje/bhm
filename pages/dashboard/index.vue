<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {useRouter} from 'vue-router'
import {BsCard, BsBadge, BsButton} from '../../components/common'
import {GENDER_LABEL, gradeTone, formatWon, formatNumber, formatDate} from '../../app/data'

import type {PaginationResponse, SingleResponse} from '~/types/commonResponse'
import type {getNoticeResponse} from '~/composables/useNoticeApi'
import type {getBidsResponse, getBidsSummaryResponse} from '~/composables/useBidsApi'
import type {BalanceResponse} from '~/types/asset/balance'

const router = useRouter()
const bidCols = '1.3fr 0.7fr 0.8fr 1.3fr 0.7fr 0.8fr 1fr'

const bidsApi = useBidsApi()
const noticesApi = useNoticeApi()
const balanceApi = useAssetApi()

const {data} = await useAsyncData(async () => {
  const [noticeData, balanceData, bidsData, bidsSummaryData] = await Promise.all([
    noticesApi.getNotices<PaginationResponse<getNoticeResponse>>({
      page: 0,
      size: 3
    }),
    balanceApi.getBalance<SingleResponse<BalanceResponse>>(),
    bidsApi.getBids<PaginationResponse<getBidsResponse>>({
      page: 0,
      size: 10
    }),
    bidsApi.getBidsSummary<SingleResponse<getBidsSummaryResponse>>()
  ])
  return {
    noticeData: noticeData?.success && noticeData?.data ? noticeData?.data : null,
    balanceData: balanceData?.success && balanceData?.data ? balanceData?.data : null,
    bidsData: bidsData?.success && bidsData?.data ? bidsData?.data : null,
    bidsSummaryData: bidsSummaryData?.success && bidsSummaryData?.data ? bidsSummaryData?.data : null
  }
})
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">경락 내역</h2>
        <p class="pg__sub">최근 낙찰받은 경락 현황을 확인하세요</p>
      </div>
    </div>

    <!-- KPI -->
    <div class="dash__stats">
      <BsCard padding="sm">
        <div class="kpi__label">총 낙찰 건수</div>
        <div class="kpi__value">{{ formatNumber(data?.bidsSummaryData?.totalCount as number) }}건</div>
        <div class="kpi__trend"><span class="kpi__sub">이번 회차</span></div>
      </BsCard>
      <BsCard padding="sm">
        <div class="kpi__label">총 낙찰 금액</div>
        <div class="kpi__value">{{ formatWon(data?.bidsSummaryData?.totalAmount as number) }}</div>
      </BsCard>
      <BsCard padding="sm">
        <div class="kpi__label">총 중량</div>
        <div class="kpi__value">{{ data?.bidsSummaryData?.totalWeight.toFixed(1) }}kg</div>
        <div class="kpi__trend"><span class="kpi__sub">부위 합계</span></div>
      </BsCard>
      <BsCard padding="sm">
        <div class="kpi__label">평균 단가</div>
        <div class="kpi__value">{{ formatWon(data?.bidsSummaryData?.avgPrice as number) }}</div>
        <div class="kpi__trend"><span class="kpi__sub">건당 평균</span></div>
      </BsCard>
    </div>

    <div class="dash__cols">
      <!-- 경락 테이블 -->
      <BsCard title="경락 상세" padding="sm">
        <template #actions>
          <BsButton variant="ghost" size="sm" @click="router.push('/auctions')">경매 보기</BsButton>
        </template>
        <div class="dt__scroll">
          <div class="dt__table" style="--dt-min: 760px">
            <div class="dt__head" :style="{gridTemplateColumns: bidCols}">
              <div class="dt__hcell">업체</div>
              <div class="dt__hcell">성별</div>
              <div class="dt__hcell">부위</div>
              <div class="dt__hcell">접수번호</div>
              <div class="dt__hcell">등급</div>
              <div class="dt__hcell dt__hcell--right">중량</div>
              <div class="dt__hcell dt__hcell--right">낙찰가</div>
            </div>
            <div v-for="b in data?.bidsData" :key="b.bidSeq" class="dt__row" :style="{gridTemplateColumns: bidCols}">
              <div class="dt__cell">{{ b.companyNm }}</div>
              <div class="dt__cell">{{ GENDER_LABEL[b.genderCd] ?? b.genderCd }}</div>
              <div class="dt__cell dt__cell--strong">{{ b.partNm }}</div>
              <div class="dt__cell dt__cell--mono dt__cell--muted">{{ b.receiptNo }}</div>
              <div>
                <BsBadge :tone="gradeTone(b.gradeCd)">{{ b.gradeCd }}</BsBadge>
              </div>
              <div class="dt__cell dt__cell--num">{{ b.weight.toFixed(1) }}kg</div>
              <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(b.bidPrice) }}</div>
            </div>
          </div>
        </div>
      </BsCard>

      <!-- 사이드: 자산 요약 + 공지 -->
      <div class="dash__side">
        <BsCard padding="md">
          <div class="dash__balance-label">보유 자산</div>
          <div class="dash__balance-value">{{ formatWon(data?.balanceData?.balance as number) }}</div>
          <div class="dash__balance-meta">
            딜러번호 {{ data?.balanceData?.dealerNo }} ·
            {{ formatDate(data?.balanceData?.updateDt as string, true) }} 기준
          </div>
          <div style="display: flex; gap: 8px; margin-top: 14px">
            <BsButton size="sm" :full-width="true" @click="router.push('/balance')">자산 관리</BsButton>
          </div>
        </BsCard>

        <BsCard title="공지사항" padding="sm">
          <template #actions>
            <BsButton variant="ghost" size="sm" @click="router.push('/notices')">전체 보기</BsButton>
          </template>
          <RouterLink
            v-for="n in data?.noticeData"
            :key="n.ntceNo"
            :to="`/notices?ntceNo=${n.ntceNo}`"
            class="dash__notice"
          >
            <BsBadge v-if="n.pinYn === 'Y'" tone="brand" size="sm">고정</BsBadge>
            <span class="dash__notice-title">{{ n.title }}</span>
            <span class="dash__notice-date">{{ formatDate(n.regDt) }}</span>
          </RouterLink>
        </BsCard>
      </div>
    </div>
  </div>
</template>
