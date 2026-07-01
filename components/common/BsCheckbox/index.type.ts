export interface BsCheckboxProps {
  /** v-model checked state */
  modelValue?: boolean
  /** Dash glyph; visually overrides checked. */
  indeterminate?: boolean
  label?: string
  disabled?: boolean
}

export interface BsCheckboxEmits {
  (e: 'update:modelValue', value: boolean): void
}
