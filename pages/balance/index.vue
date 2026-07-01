<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {BsCard} from '../../components/common'
import AppIcon from '../../app/AppIcon/index.vue'
import {useToast} from '../../composables/useToast'
import {BALANCE, TRANSACTIONS, formatWon, formatWonSigned, formatDate} from '../../app/data'

const toast = useToast()

function deposit() {
  toast({tone: 'info', title: '입금 안내', message: '가상계좌로 입금하시면 자동 반영됩니다.'})
}
function withdraw() {
  toast({tone: 'success', title: '출금 요청이 접수되었습니다'})
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">자산</h2>
        <p class="pg__sub">보유 잔고와 입출금 내역을 관리하세요</p>
      </div>
    </div>

    <div class="bal__cols">
      <!-- 잔고 hero -->
      <div class="bal__hero">
        <div class="bal__hero-label">보유 자산</div>
        <div class="bal__hero-value">{{ formatWon(BALANCE.balance) }}</div>
        <div class="bal__hero-meta">
          딜러번호 {{ BALANCE.dealerNo }} · {{ formatDate(BALANCE.updateDt, true) }} 기준
        </div>
        <div class="bal__hero-actions">
          <button class="bal__btn" @click="deposit">
            <AppIcon name="arrowDownLeft" :size="16" :stroke="2" /> 입금
          </button>
          <button class="bal__btn" @click="withdraw">
            <AppIcon name="arrowUpRight" :size="16" :stroke="2" /> 출금
          </button>
        </div>
      </div>

      <!-- 거래 내역 -->
      <BsCard title="거래 내역" padding="sm">
        <div v-for="(t, i) in TRANSACTIONS" :key="i" class="bal__tx">
          <span class="bal__tx-icon" :class="t.amount >= 0 ? 'bal__tx-icon--in' : 'bal__tx-icon--out'">
            <AppIcon :name="t.amount >= 0 ? 'arrowDownLeft' : 'arrowUpRight'" :size="17" :stroke="2" />
          </span>
          <div class="bal__tx-body">
            <div class="bal__tx-desc">{{ t.description }}</div>
            <div class="bal__tx-date">{{ formatDate(t.regDt, true) }}</div>
          </div>
          <div class="bal__tx-amount" :class="t.amount >= 0 ? 'bal__tx-amount--in' : 'bal__tx-amount--out'">
            {{ formatWonSigned(t.amount) }}
          </div>
        </div>
      </BsCard>
    </div>
  </div>
</template>
