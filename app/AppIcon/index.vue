<script setup lang="ts">
import {computed} from 'vue'
import type {AppIconProps} from './index.type'
import {APP_ICONS} from './index.constant'

const props = withDefaults(defineProps<AppIconProps>(), {
  size: 18,
  stroke: 1.8
})

const inner = computed(() => APP_ICONS[props.name] ?? '')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="inner"
  />
</template>
