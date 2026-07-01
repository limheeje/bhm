export type BsInputSize = 'sm' | 'md' | 'lg'

export interface BsInputProps {
  /** v-model value */
  modelValue?: string
  label?: string
  placeholder?: string
  /** Native input type. @default 'text' */
  type?: string
  /** @default 'md' */
  size?: BsInputSize
  disabled?: boolean
  /** Error state (use with errorText). */
  invalid?: boolean
  /** Neutral helper text (hidden when an error shows). */
  hint?: string
  /** Error message shown when invalid. */
  errorText?: string
}

export interface BsInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: Event): void
}
