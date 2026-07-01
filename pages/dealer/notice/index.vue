<script setup lang="ts">
import type {GetNoticesResponse} from '~/composables/useNoticeApi'

const api = useNoticeApi()
const localNoticeItems = ref<GetNoticesResponse | null>(null)

onMounted(async () => {
  try {
    const res = await api.getNoticeList({
      page: 1,
      size: 20
    })
    if (res?.success && res?.data) localNoticeItems.value = res.data
    console.log('res---', res)
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div>
    나눈나눈
    <ul v-if="localNoticeItems">
      <li v-for="(item, index) in localNoticeItems.list" :key="index">
        <NuxtLink :to="{path: `/dealer/notice/${item.ntceNo}`}">{{ item.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
