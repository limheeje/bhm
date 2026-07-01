<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsBadgeProps} from './index.type'

const props = withDefaults(defineProps<BsBadgeProps>(), {
  tone: 'neutral',
  dot: false,
  size: 'md'
})

const classes = computed(() => [
  'bs-badge',
  `bs-badge--${props.tone}`,
  `bs-badge--${props.size}`,
  {'bs-badge--has-dot': props.dot}
])
</script>

<template>
  <span :class="classes">
    <span v-if="dot" class="bs-badge__dot" />
    <slot />
  </span>
</template>
