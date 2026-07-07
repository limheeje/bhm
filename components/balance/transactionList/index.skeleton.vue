<script setup lang="ts">
import '~/components/balance/transactionList/index.style.scss'
import {BsSkeleton} from '~/components/common'

withDefaults(defineProps<{rows?: number}>(), {rows: 5})
</script>

<template>
  <div class="tx-list" aria-hidden="true">
    <div v-for="n in rows" :key="n" class="tx-list__row">
      <BsSkeleton circle width="34px" height="34px" />
      <div class="tx-list__body">
        <BsSkeleton width="55%" height="14px" />
        <BsSkeleton width="35%" height="11px" />
      </div>
      <BsSkeleton width="64px" height="16px" />
    </div>
  </div>
</template>
