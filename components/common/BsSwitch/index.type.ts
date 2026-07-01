export type BsSwitchSize = 'sm' | 'md'

export interface BsSwitchProps {
  /** v-model on/off state */
  modelValue?: boolean
  label?: string
  /** @default 'md' */
  size?: BsSwitchSize
  disabled?: boolean
}

export interface BsSwitchEmits {
  (e: 'update:modelValue', value: boolean): void
}
