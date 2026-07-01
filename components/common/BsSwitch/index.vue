<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsSwitchProps, BsSwitchEmits} from './index.type'

const props = withDefaults(defineProps<BsSwitchProps>(), {
  modelValue: false,
  size: 'md',
  disabled: false
})
const emit = defineEmits<BsSwitchEmits>()

const rootClasses = computed(() => [
  'bs-switch',
  `bs-switch--${props.size}`,
  {'bs-switch--on': props.modelValue, 'bs-switch--disabled': props.disabled}
])

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label :class="rootClasses" role="switch" :aria-checked="modelValue" @click.prevent="toggle">
    <span class="bs-switch__track"><span class="bs-switch__knob" /></span>
    <span v-if="label" class="bs-switch__label">{{ label }}</span>
  </label>
</template>
