<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsToastProps, BsToastEmits} from './index.type'
import {BS_TOAST_GLYPHS} from './index.constant'

const props = withDefaults(defineProps<BsToastProps>(), {
  tone: 'neutral',
  closable: true
})
defineEmits<BsToastEmits>()
console.log('BsToast-----props---', props)

const glyph = computed(() => BS_TOAST_GLYPHS[props.tone] ?? BS_TOAST_GLYPHS.info)
</script>

<template>
  <div :class="['bs-toast', `bs-toast--${tone}`]" role="status">
    <span class="bs-toast__icon">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        v-html="glyph"
      />
    </span>
    <div class="bs-toast__body">
      <div v-if="title" class="bs-toast__title">{{ title }}</div>
      <div v-if="message" class="bs-toast__message">{{ message }}</div>
    </div>
    <button v-if="closable" class="bs-toast__close" aria-label="닫기" @click="$emit('close')">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
