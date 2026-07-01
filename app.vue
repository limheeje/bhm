<script setup lang="ts">
import {BsToastProvider, BsModalProvider} from '~/components/common'
</script>

<template>
  <BsToastProvider>
    <BsModalProvider>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </BsModalProvider>
  </BsToastProvider>
</template>
