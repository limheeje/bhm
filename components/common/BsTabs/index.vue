<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsTabsProps, BsTabsEmits, BsTabItem} from './index.type'

const props = withDefaults(defineProps<BsTabsProps>(), {
  modelValue: '',
  tabs: () => []
})
const emit = defineEmits<BsTabsEmits>()

const normalized = computed<BsTabItem[]>(() =>
  props.tabs.map((t) => (typeof t === 'string' ? {value: t, label: t} : t))
)
</script>

<template>
  <div class="bs-tabs" role="tablist">
    <button
      v-for="t in normalized"
      :key="t.value"
      role="tab"
      :aria-selected="t.value === modelValue"
      :class="['bs-tabs__tab', {'bs-tabs__tab--active': t.value === modelValue}]"
      @click="emit('update:modelValue', t.value)"
    >
      {{ t.label }}
      <span v-if="t.count != null" class="bs-tabs__count">{{ t.count }}</span>
    </button>
  </div>
</template>
