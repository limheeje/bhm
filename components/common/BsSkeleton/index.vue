<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsSkeletonProps} from './index.type'

const props = withDefaults(defineProps<BsSkeletonProps>(), {
  width: '100%',
  height: '14px',
  circle: false
})

const toSize = (v: string | number) => (typeof v === 'number' ? `${v}px` : v)

const style = computed(() => ({
  width: toSize(props.width),
  height: toSize(props.height),
  borderRadius: props.circle ? '50%' : (props.radius ?? 'var(--radius-sm)')
}))
</script>

<template>
  <span class="bs-skeleton" :style="style" aria-hidden="true" />
</template>
