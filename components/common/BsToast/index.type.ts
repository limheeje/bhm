import type {ToastTone} from '~/composables/useToast'

export type {ToastTone}

export interface BsToastProps {
  /** @default 'neutral' */
  tone?: ToastTone
  title?: string
  message?: string
  /** Show the close button. @default true */
  closable?: boolean
}

export interface BsToastEmits {
  (e: 'close'): void
}
