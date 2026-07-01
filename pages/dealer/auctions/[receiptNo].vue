<script setup lang="ts">
const route = useRoute()
const receiptNo = route.params.receiptNo as string
</script>

<template>
  <div>receiptNoreceiptNo : {{ receiptNo }}</div>
</template>
