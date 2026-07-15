<script setup lang="ts">
import '~/app/shared.scss'
import './index.style.scss'
import {ref, onMounted, onUnmounted} from 'vue'
import {BsCard, BsBadge, BsButton, BsInput} from '~/components/common'
import {gradeTone, formatWon} from '~/app/data'

interface LiveLot {
  lotId: string
  receiptNo: string
  partNm: string
  gradeCd: string
  companyNm: string
  startPrice: number
  currentPrice: number
  bidCount: number
  status: 'ACTIVE' | 'END'
  highestBidderLabel: string | null
}

const cols = '0.9fr 1.1fr 0.6fr 1fr 1.1fr 0.8fr 1.3fr'

const lots = ref<LiveLot[]>([])
const bidInputs = ref<Record<string, string>>({})
const errorMessage = ref('')
let ws: WebSocket | null = null

onMounted(() => {
  ws = new WebSocket(`ws://${location.host}/api/dealer/auctions/live`)

  ws.onmessage = (event) => {
    const {type, payload} = JSON.parse(event.data)

    if (type === 'INIT') {
      lots.value = payload.lots
    }

    if (type === 'BID_UPDATE') {
      const target = lots.value.find((l) => l.lotId === payload.lotId)
      if (target) Object.assign(target, payload)
    }

    if (type === 'LOT_CLOSED') {
      const target = lots.value.find((l) => l.lotId === payload.lotId)
      if (target) target.status = 'END'
    }

    if (type === 'LOT_REPLACED') {
      const idx = lots.value.findIndex((l) => l.lotId === payload.closedLotId)
      if (idx === -1) {
        lots.value.push(payload.newLot)
      } else {
        lots.value.splice(idx, 1, payload.newLot)
      }
    }

    if (type === 'BID_REJECTED') {
      errorMessage.value = payload.message
    }
  }
})

onUnmounted(() => {
  ws?.close() // 페이지 나갈 때 꼭 끊어야 해요 — 안 끊으면 계속 연결이 남아있어요
})

function onClickBid(lotId: string) {
  const price = Number(bidInputs.value[lotId])
  if (!price) return
  errorMessage.value = ''
  ws?.send(JSON.stringify({type: 'BID', payload: {lotId, price}}))
  bidInputs.value[lotId] = ''
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">실시간 경매 현황</h2>
        <p class="pg__sub">지금 진행 중인 회차의 입찰 상황을 실시간으로 확인하세요</p>
      </div>
      <div class="pg__actions">
        <BsBadge tone="success" dot>실시간 연결됨</BsBadge>
      </div>
    </div>

    <p v-if="errorMessage" class="live__error">{{ errorMessage }}</p>

    <BsCard padding="none">
      <div class="dt__scroll">
        <div class="dt__table" style="--dt-min: 860px">
          <div class="dt__head" :style="{gridTemplateColumns: cols}">
            <div class="dt__hcell">부위</div>
            <div class="dt__hcell">업체</div>
            <div class="dt__hcell">등급</div>
            <div class="dt__hcell dt__hcell--right">현재가</div>
            <div class="dt__hcell">최고 입찰자</div>
            <div class="dt__hcell">상태</div>
            <div class="dt__hcell">입찰</div>
          </div>

          <div v-for="lot in lots" :key="lot.lotId" class="dt__row" :style="{gridTemplateColumns: cols}">
            <div class="dt__cell dt__cell--strong">{{ lot.partNm }}</div>
            <div class="dt__cell dt__cell--muted">{{ lot.companyNm }}</div>
            <div>
              <BsBadge :tone="gradeTone(lot.gradeCd)">{{ lot.gradeCd }}</BsBadge>
            </div>
            <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(lot.currentPrice) }}</div>
            <div class="live__bidder">{{ lot.highestBidderLabel ?? '-' }} · {{ lot.bidCount }}회</div>
            <div>
              <BsBadge :tone="lot.status === 'ACTIVE' ? 'success' : 'neutral'">
                {{ lot.status === 'ACTIVE' ? '진행중' : '마감' }}
              </BsBadge>
            </div>
            <div v-if="lot.status === 'ACTIVE'" class="live__bid">
              <div class="live__bid-input">
                <BsInput v-model="bidInputs[lot.lotId]" type="number" size="sm" placeholder="입찰가" />
              </div>
              <BsButton size="sm" @click="onClickBid(lot.lotId)">입찰</BsButton>
            </div>
            <div v-else class="dt__cell dt__cell--muted">-</div>
          </div>

          <div v-if="!lots.length" class="empty">
            <div class="empty__text">연결 중이에요...</div>
          </div>
        </div>
      </div>
    </BsCard>
  </div>
</template>
