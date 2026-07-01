<script setup lang="ts">
import './index.style.scss'
import {computed, useId} from 'vue'
import type {BsSelectProps, BsSelectEmits, BsSelectOption} from './index.type'

const props = withDefaults(defineProps<BsSelectProps>(), {
  modelValue: '',
  options: () => [],
  placeholder: '선택하세요',
  size: 'md',
  disabled: false,
  invalid: false
})
const emit = defineEmits<BsSelectEmits>()

const uid = useId()
const normalized = computed<BsSelectOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? {value: o, label: o} : o))
)
const rootClasses = computed(() => [
  'bs-select',
  {'bs-select--disabled': props.disabled, 'bs-select--invalid': props.invalid}
])

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div :class="rootClasses">
    <label v-if="label" :for="uid" class="bs-select__label">{{ label }}</label>
    <div class="bs-select__wrap">
      <select
        :id="uid"
        :class="['bs-select__control', `bs-select__control--${size}`]"
        :value="modelValue"
        :disabled="disabled"
        :data-placeholder="!modelValue"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="o in normalized" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <span class="bs-select__chevron">
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
    <span v-if="hint" class="bs-select__hint">{{ hint }}</span>
  </div>
</template>
