<script setup lang="ts">
import './index.style.scss'
import {computed} from 'vue'
import type {BsIconButtonProps, BsIconButtonEmits} from './index.type'

const props = withDefaults(defineProps<BsIconButtonProps>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false
})
defineEmits<BsIconButtonEmits>()

const classes = computed(() => ['bs-icon-button', `bs-icon-button--${props.variant}`, `bs-icon-button--${props.size}`])
</script>

<template>
  <button type="button" :class="classes" :aria-label="ariaLabel" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
