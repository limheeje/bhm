<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsToggleGroupProps, BsToggleGroupEmits, BsToggleOption} from './index.type'

const props = withDefaults(defineProps<BsToggleGroupProps>(), {
  modelValue: '',
  options: () => [],
  size: 'md',
  fullWidth: false
})
const emit = defineEmits<BsToggleGroupEmits>()

const normalized = computed<BsToggleOption[]>(() =>
  props.options.map((o) => (typeof o === 'string' ? {value: o, label: o} : o))
)
const rootClasses = computed(() => [
  'bs-toggle-group',
  `bs-toggle-group--${props.size}`,
  {'bs-toggle-group--full': props.fullWidth}
])
</script>

<template>
  <div :class="rootClasses" role="tablist">
    <button
      v-for="o in normalized"
      :key="o.value"
      role="tab"
      :aria-selected="o.value === modelValue"
      :class="['bs-toggle-group__option', {'bs-toggle-group__option--active': o.value === modelValue}]"
      @click="emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
