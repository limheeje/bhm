<script setup lang="ts">
import StringUtil from '~/utils/StringUtil'
const route = useRoute()
// const router = useRouter()
const ntceNo = route.params.ntceNo as string
const api = useNoticeApi()
// const localNoticeDetailInfo = ref<any>()

// onMounted(async () => {
//   try {
//     console.log('ntceNo---', typeof ntceNo)
//     if (!ntceNo) return router.back()
//     const res = await api.getNoticeDetail(ntceNo)
//     console.log('res----', res)
//     if (res?.success && res?.data) localNoticeDetailInfo.value = res.data
//   } catch (err) {
//     console.log(err)
//   }
// })

const {data: localNoticeDetailInfo} = await useAsyncData(`notice-${ntceNo}`, async () => {
  const res = await api.getNoticeDetail(ntceNo)
  console.log('res----', res)
  if (res?.success && res?.data) return res.data
  return null
})
</script>

<template>
  <div>
    params
    <template v-if="localNoticeDetailInfo">
      {{ localNoticeDetailInfo.title }}<br />
      <div style="padding: 20px">
        <pre style="white-space: pre-line">{{ localNoticeDetailInfo.content }}</pre>
      </div>
      {{ StringUtil.formatDate(localNoticeDetailInfo.regDt, 'YY.MM.HH') }}
    </template>
  </div>
</template>
