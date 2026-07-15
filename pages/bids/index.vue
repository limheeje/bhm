<script setup lang="ts">
import '~/app/shared.scss'
import './index.style.scss'
import {BsCard, BsBadge, BsButton, BsInput, BsSwitch, BsPagination} from '~/components/common'
import {gradeTone, formatWon, GENDER_LABEL} from '~/app/data'
import type {PaginationResponse} from '~/types/commonResponse'
import type {GetBidsListResponse} from '~/composables/useBidsApi'

const cols = '1.2fr 1.3fr 0.9fr 0.7fr 1.1fr 0.7fr 0.8fr 1fr 0.8fr'

// 화면 확인용 더미 데이터 — 실제 API 연동은 프론트에서 진행
const api = useBidsApi()
const currentPage = ref(1)
const localCheck = ref(false)
const localStartDate = ref<string>('')
const localEndDate = ref<string>('')
const {data: localData, refresh} = useAsyncData(
  `pages-bids`,
  async () => {
    const res = await api.getList<PaginationResponse<GetBidsListResponse>>({
      page: currentPage.value - 1,
      hideUnsold: localCheck.value.toString(),
      startDate: localStartDate.value,
      endDate: localEndDate.value
    })
    if (res?.success) {
      console.log('res---', res)

      return {
        data: res.data,
        pageInfo: res.pageInfo
      }
    }
  },
  {
    watch: [currentPage]
  }
)

function onClickRefresh() {
  currentPage.value = 1
  refresh()
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">경락내역</h2>
        <p class="pg__sub">낙찰받은 소·부위 내역을 기간별로 조회하세요</p>
      </div>
      <div class="pg__actions">
        <BsBadge tone="info" dot>{{ localData?.pageInfo.totalElements }}건 조회됨</BsBadge>
      </div>
    </div>

    <BsCard padding="none">
      <!-- 필터 -->
      <div class="bids__toolbar">
        <div class="bids__filters">
          <div class="bids__filter">
            <BsInput v-model="localStartDate" type="date" label="시작일" />
          </div>
          <div class="bids__filter">
            <BsInput v-model="localEndDate" type="date" label="종료일" />
          </div>
          <div class="bids__switch">
            <BsSwitch v-model="localCheck" label="유찰 건 숨기기" />
          </div>
        </div>
        <BsButton size="sm" @click="onClickRefresh">조회</BsButton>
      </div>

      <!-- 테이블 -->
      <div class="bids__table">
        <div class="dt__scroll">
          <div class="dt__table" style="--dt-min: 920px">
            <div class="dt__head" :style="{gridTemplateColumns: cols}">
              <div class="dt__hcell">낙찰일시</div>
              <div class="dt__hcell">접수번호</div>
              <div class="dt__hcell">부위</div>
              <div class="dt__hcell">등급</div>
              <div class="dt__hcell">업체</div>
              <div class="dt__hcell">성별</div>
              <div class="dt__hcell dt__hcell--right">중량</div>
              <div class="dt__hcell dt__hcell--right">낙찰가</div>
              <div class="dt__hcell">상태</div>
            </div>

            <div
              v-for="r in localData?.data"
              :key="r.receiptNo + r.partNm"
              class="dt__row"
              :style="{gridTemplateColumns: cols}"
            >
              <div class="dt__cell dt__cell--mono dt__cell--muted">{{ r.bidDt }}</div>
              <NuxtLink
                :to="{
                  path: `/auctions/${r.receiptNo}`
                }"
                class="dt__cell dt__cell--mono dt__cell--strong"
                >{{ r.receiptNo }}</NuxtLink
              >
              <div class="dt__cell dt__cell--strong">{{ r.partNm }}</div>
              <div>
                <BsBadge :tone="gradeTone(r.gradeCd)">{{ r.gradeCd }}</BsBadge>
              </div>
              <div class="dt__cell dt__cell--muted">{{ r.companyNm }}</div>
              <div class="dt__cell">{{ GENDER_LABEL[r.genderCd] ?? r.genderCd }}</div>
              <div class="dt__cell dt__cell--num">{{ r.weight.toFixed(1) }}kg</div>
              <div class="dt__cell dt__cell--num dt__cell--strong">
                {{ r.unsoldYn === 'Y' ? '-' : formatWon(r.bidPrice) }}
              </div>
              <div>
                <BsBadge :tone="r.unsoldYn === 'Y' ? 'neutral' : 'success'">
                  {{ r.unsoldYn === 'Y' ? '유찰' : '낙찰' }}
                </BsBadge>
              </div>
            </div>
          </div>
        </div>

        <div class="dt__foot">
          <span class="dt__foot-count" />
          <BsPagination v-model="currentPage" :total="localData?.pageInfo.totalPages" />
        </div>
      </div>
    </BsCard>
  </div>
</template>
