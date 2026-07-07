<script setup lang="ts">
import '~/app/shared.scss'
import '~/pages/balance/index.style.scss'
import {BsCard, BsPagination} from '~/components/common'
import TransactionList from '~/components/balance/transactionList/index.vue'
import TransactionSkeleton from '~/components/balance/transactionList/index.skeleton.vue'
import type {BalanceResponse} from '~/types/asset/balance'
import type {TransactionsDataResponse} from '~/types/asset/transactions'
import {formatDate, formatWon} from '~/app/data'
import type {SingleResponse, PaginationResponse} from '~/types/commonResponse'

const api = useAssetApi()
const currentPage = reactive({
  page: 1,
  size: 5
})
const {data: balanceData, pending: balancePending} = await useAsyncData(
  'pages-balance',
  async () => await api.getBalance<SingleResponse<BalanceResponse>>()
)
const {data: transactionsData, pending: transactionsPending} = await useAsyncData(
  'pages-transactions',
  async () =>
    await api.getTransactions<PaginationResponse<TransactionsDataResponse>>({
      page: currentPage.page - 1,
      size: currentPage.size
    }),
  {watch: [currentPage]}
)

//{ "balance": 5280000, "dealerNo": "003", "updateDt": "2026-06-29T08:30:00" }
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
        <template v-if="balancePending"> 불러오는중.. </template>
        <template v-else>
          <div class="bal__hero-value">{{ formatWon(balanceData?.data?.balance as number) }}</div>
          <div class="bal__hero-meta">
            딜러번호 {{ balanceData?.data?.dealerNo }} ·
            {{ formatDate(balanceData?.data?.updateDt as string, true) }} 기준
          </div>
        </template>
      </div>

      <!-- 거래 내역 -->
      <BsCard title="거래 내역" padding="sm">
        <template v-if="transactionsPending">
          <TransactionSkeleton :rows="5" />
        </template>
        <template v-else>
          <TransactionList :items="transactionsData?.data ?? []" />
        </template>
        <BsPagination v-model="currentPage.page" :total="transactionsData?.pageInfo.totalPages" />
      </BsCard>
    </div>
  </div>
</template>
