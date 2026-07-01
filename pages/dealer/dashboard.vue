<script setup lang="ts">
import type {SingleResponse} from '~/types/commonResponse'

const authStore = useAuthStore()
const localItems = ref<Record<string, any>[]>([])
const handleGetBids = async () => {
  const res = await useClientFetch.get<
    SingleResponse<{
      list: Record<string, any>[]
      pageInfo: Record<string, any>
      summary: Record<string, any>
    }>
  >('/dealer/auctions/bids', {
    startDate: '2026-06-01',
    endDate: '2026-06-22',
    page: 0,
    size: 10
  })

  if (res.success) {
    localItems.value = res.data.list
    console.log('localItems.value----', localItems)
  }
}

async function logout() {
  const res = await useLoginApi.logout()
  console.log('res---', res)

  if (res.success) {
    authStore.setLogout()
    navigateTo('/login')
  }
}
</script>

<template>
  <div>
    <button @click="handleGetBids">경락 내역 테스트</button>
    <ul>
      <template v-if="localItems.length">
        <template v-for="(item, index) in localItems" :key="index">
          <li>{{ `${item.companyNm}/${item.genderCd}/${item.partNm}/${item.bidSeq}` }}</li>
        </template>
      </template>
      <template v-else>
        <div class="space-y-2"><USkeleton class="h-7 w-full" /><USkeleton class="h-7 w-full" /></div>
      </template>
    </ul>

    <button @click="logout">로그아웃</button>
  </div>
</template>
