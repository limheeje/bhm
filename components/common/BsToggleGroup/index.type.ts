export interface BsToggleOption {
  value: string
  label: string
}

export type BsToggleGroupSize = 'sm' | 'md' | 'lg'

export interface BsToggleGroupProps {
  /** Selected value (v-model). */
  modelValue?: string
  /** Options as strings or {value,label} objects. */
  options?: (string | BsToggleOption)[]
  /** @default 'md' */
  size?: BsToggleGroupSize
  /** Stretch options to fill the container. @default false */
  fullWidth?: boolean
}

export interface BsToggleGroupEmits {
  (e: 'update:modelValue', value: string): void
}
