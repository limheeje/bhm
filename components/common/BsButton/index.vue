<script setup lang="ts">
import './index.style.scss'
import {computed, useSlots} from 'vue'
import type {BsButtonProps, BsButtonEmits} from './index.type'
import {BS_BUTTON_DEFAULTS} from './index.constant'

const props = withDefaults(defineProps<BsButtonProps>(), BS_BUTTON_DEFAULTS)
defineEmits<BsButtonEmits>()

const slots = useSlots()

const classes = computed(() => [
  'bs-button',
  `bs-button--${props.variant}`,
  `bs-button--${props.size}`,
  {'bs-button--full': props.fullWidth}
])
</script>

<template>
  <button :class="classes" :type="type" :disabled="disabled" @click="$emit('click', $event)">
    <span v-if="slots.lead" class="bs-button__icon bs-button__icon--lead"><slot name="lead" /></span>
    <slot />
    <span v-if="slots.trail" class="bs-button__icon bs-button__icon--trail"><slot name="trail" /></span>
  </button>
</template>
