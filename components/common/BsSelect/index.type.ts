export interface BsSelectOption {
  value: string
  label: string
}

export type BsSelectSize = 'sm' | 'md' | 'lg'

export interface BsSelectProps {
  modelValue?: string
  label?: string
  /** Options as strings or {value,label} objects. */
  options?: (string | BsSelectOption)[]
  placeholder?: string
  /** @default 'md' */
  size?: BsSelectSize
  disabled?: boolean
  invalid?: boolean
  hint?: string
}

export interface BsSelectEmits {
  (e: 'update:modelValue', value: string): void
}
