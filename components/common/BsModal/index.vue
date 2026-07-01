<script setup lang="ts">
import './index.style.scss'
import {onBeforeUnmount, onMounted, ref, useSlots, watch, nextTick} from 'vue'
import type {BsModalProps, BsModalEmits} from './index.type'

const props = withDefaults(defineProps<BsModalProps>(), {
  modelValue: false,
  size: 'md',
  closeOnOverlay: true
})
const emit = defineEmits<BsModalEmits>()
const slots = useSlots()

const uid = Math.random().toString(36).slice(2)
const titleId = `bs-modal-title-${uid}`
const descId = `bs-modal-desc-${uid}`

const dialogRef = ref<HTMLElement | null>(null)
let prevFocused: HTMLElement | null = null

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

function getFocusable(): HTMLElement[] {
  return Array.from(dialogRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ?? [])
}

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab') return
  const focusable = getFocusable()
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      prevFocused = document.activeElement as HTMLElement
      await nextTick()
      const focusable = getFocusable()
      if (focusable.length) focusable[0].focus()
      else dialogRef.value?.focus()
    } else {
      prevFocused?.focus()
      prevFocused = null
    }
  }
)

function close() {
  emit('update:modelValue', false)
  emit('close')
}
function onOverlay() {
  if (props.closeOnOverlay) close()
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="bs-modal">
      <div v-if="modelValue" class="bs-modal" aria-hidden="false" @mousedown.self="onOverlay">
        <div
          ref="dialogRef"
          :class="['bs-modal__dialog', `bs-modal__dialog--${size}`]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-describedby="description ? descId : undefined"
          tabindex="-1"
          @keydown="trapFocus"
        >
          <header v-if="title" class="bs-modal__header">
            <div class="bs-modal__heading">
              <h2 :id="titleId" class="bs-modal__title">{{ title }}</h2>
              <p v-if="description" :id="descId" class="bs-modal__desc">{{ description }}</p>
            </div>
            <button class="bs-modal__close" aria-label="닫기" @click="close">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div class="bs-modal__body"><slot /></div>
          <footer v-if="slots.footer" class="bs-modal__footer"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
