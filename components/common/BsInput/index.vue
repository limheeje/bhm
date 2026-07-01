<script setup lang="ts">
import './index.style.scss'
import {computed, useId, useSlots} from 'vue'
import type {BsInputProps, BsInputEmits} from './index.type'

const props = withDefaults(defineProps<BsInputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  invalid: false
})
const emit = defineEmits<BsInputEmits>()
const slots = useSlots()

const uid = useId()
const showError = computed(() => props.invalid && !!props.errorText)

const rootClasses = computed(() => [
  'bs-input',
  {'bs-input--disabled': props.disabled, 'bs-input--invalid': props.invalid}
])

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div :class="rootClasses">
    <label v-if="label" :for="uid" class="bs-input__label">{{ label }}</label>
    <div :class="['bs-input__field', `bs-input__field--${size}`]">
      <span v-if="slots.lead" class="bs-input__affix"><slot name="lead" /></span>
      <input
        :id="uid"
        class="bs-input__control"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <span v-if="slots.trail" class="bs-input__affix"><slot name="trail" /></span>
    </div>
    <span v-if="showError" class="bs-input__error">{{ errorText }}</span>
    <span v-else-if="hint" class="bs-input__hint">{{ hint }}</span>
  </div>
</template>
