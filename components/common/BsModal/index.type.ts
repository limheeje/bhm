export type BsModalSize = 'sm' | 'md' | 'lg'

export interface BsModalProps {
  /** Visibility (v-model). */
  modelValue?: boolean
  title?: string
  description?: string
  /** @default 'md' (sm 400 / md 540 / lg 720) */
  size?: BsModalSize
  /** Close when the overlay is clicked. @default true */
  closeOnOverlay?: boolean
}

export interface BsModalEmits {
  (e: 'update:modelValue', open: boolean): void
  (e: 'close'): void
}
