<script setup lang="ts">
import './index.style.scss'
import AppIcon from '~/app/AppIcon/index.vue'
import {formatWonSigned, formatDate} from '~/app/data'
import type {TransactionListProps} from './index.type'

const props = withDefaults(defineProps<TransactionListProps>(), {})
</script>

<template>
  <div class="tx-list">
    <div v-for="(t, i) in props.items" :key="i" class="tx-list__row">
      <span class="tx-list__icon" :class="t.amount >= 0 ? 'tx-list__icon--in' : 'tx-list__icon--out'">
        <AppIcon :name="t.amount >= 0 ? 'arrowDownLeft' : 'arrowUpRight'" :size="17" :stroke="2" />
      </span>
      <div class="tx-list__body">
        <div class="tx-list__desc">{{ t.description }}</div>
        <div class="tx-list__date">{{ formatDate(t.regDt, true) }}</div>
      </div>
      <div class="tx-list__amount" :class="t.amount >= 0 ? 'tx-list__amount--in' : 'tx-list__amount--out'">
        {{ formatWonSigned(t.amount) }}
      </div>
    </div>
  </div>
</template>
