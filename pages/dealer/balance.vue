<script setup lang="ts">
import type {SingleResponse} from '~/types/commonResponse'
import type {GetBalance, GetTransactions} from '~/composables/useAssetApi'
import StringUtil from '~/utils/StringUtil'

const api = useAssetApi()
const localBalance = ref<GetBalance>()
const localTransactions = ref<GetTransactions>()

onMounted(async () => {
  loadBanance()
  loadTransactions()
})

async function loadBanance() {
  try {
    const res = await api.getBalance<SingleResponse<GetBalance>>()
    if (res?.success && res?.data) localBalance.value = res.data
  } catch (err) {
    console.log(err)
  }
}
async function loadTransactions() {
  try {
    const res = await api.getTransactions<SingleResponse<GetTransactions>>({
      page: 1,
      size: 20
    })
    if (res?.success && res?.data) localTransactions.value = res.data
  } catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <div>
    <div>현재잔고</div>
    {{ StringUtil.formatComma(localBalance?.balance) }}<br />
    {{ localBalance }}
    {{ localTransactions }}<br />
  </div>
</template>
