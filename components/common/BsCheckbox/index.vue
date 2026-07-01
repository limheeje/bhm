<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsCheckboxProps, BsCheckboxEmits} from './index.type'

const props = withDefaults(defineProps<BsCheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false
})
const emit = defineEmits<BsCheckboxEmits>()

const on = computed(() => props.modelValue || props.indeterminate)
const rootClasses = computed(() => [
  'bs-checkbox',
  {'bs-checkbox--on': on.value, 'bs-checkbox--disabled': props.disabled}
])

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label :class="rootClasses" @click.prevent="toggle">
    <span class="bs-checkbox__box">
      <svg
        v-if="indeterminate"
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3.5"
        stroke-linecap="round"
      >
        <path d="M6 12h12" />
      </svg>
      <svg
        v-else-if="modelValue"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
    <span v-if="label" class="bs-checkbox__label">{{ label }}</span>
  </label>
</template>
