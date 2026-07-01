<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsPaginationProps, BsPaginationEmits} from './index.type'

const props = withDefaults(defineProps<BsPaginationProps>(), {
  modelValue: 1,
  total: 1
})
const emit = defineEmits<BsPaginationEmits>()

function go(p: number) {
  if (p >= 1 && p <= props.total && p !== props.modelValue) emit('update:modelValue', p)
}

const pages = computed<(number | '…')[]>(() => {
  const out: (number | '…')[] = []
  const cur = props.modelValue
  const l = Math.max(2, cur - 1)
  const r = Math.min(props.total - 1, cur + 1)
  out.push(1)
  if (l > 2) out.push('…')
  for (let i = l; i <= r; i++) out.push(i)
  if (r < props.total - 1) out.push('…')
  if (props.total > 1) out.push(props.total)
  return out
})
</script>

<template>
  <nav class="bs-pagination">
    <button class="bs-pagination__btn" :disabled="modelValue <= 1" @click="go(modelValue - 1)">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <template v-for="(p, i) in pages" :key="i">
      <span v-if="p === '…'" class="bs-pagination__ellipsis">…</span>
      <button
        v-else
        :class="['bs-pagination__btn', {'bs-pagination__btn--active': p === modelValue}]"
        :aria-current="p === modelValue"
        @click="go(p as number)"
      >
        {{ p }}
      </button>
    </template>
    <button class="bs-pagination__btn" :disabled="modelValue >= total" @click="go(modelValue + 1)">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </button>
  </nav>
</template>
