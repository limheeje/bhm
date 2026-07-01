<script setup lang="ts">
const props = defineProps<{
  error: {statusCode: number; message: string}
}>()

onMounted(() => {
  if (props.error.statusCode === 404) {
    navigateTo('/login')
  }
})
</script>

<template>
  <div>오류가 발생했습니다.</div>
</template>
