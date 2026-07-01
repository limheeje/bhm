import {inject, provide, reactive, type Component, type InjectionKey} from 'vue'
import type {BsModalSize} from '~/components/common/BsModal/index.type'
import type {BsButtonVariant, BsButtonSize} from '~/components/common/BsButton/index.type'

export interface ModalButton {
  label: string
  style?: {
    variant?: BsButtonVariant
    size?: BsButtonSize
    disabled?: boolean
    fullWidth?: boolean
  }
  callback?: () => void | Promise<void>
}

export interface ModalOptions {
  title?: string
  description?: string
  size?: BsModalSize
  closeOnOverlay?: boolean
  component?: Component
  componentProps?: Record<string, unknown>
  buttons?: ModalButton[]
  onClose?: () => void
}

export interface ModalController {
  open: (options: ModalOptions) => void
  close: () => void
}

export const BS_MODAL_KEY: InjectionKey<ModalController> = Symbol('bs-modal')

export interface ModalProviderState {
  isOpen: boolean
  options: ModalOptions
}

export function provideModal(): ModalProviderState {
  const state = reactive<ModalProviderState>({
    isOpen: false,
    options: {}
  })

  const open = (options: ModalOptions) => {
    state.options = options
    state.isOpen = true
  }

  const close = () => {
    state.isOpen = false
    state.options.onClose?.()
  }

  provide(BS_MODAL_KEY, {open, close})
  return state
}

export function useModal(): ModalController {
  const ctrl = inject(BS_MODAL_KEY, null)
  if (!ctrl) {
    return {
      open: () => console.warn('[BsModal] useModal() called without <BsModalProvider> ancestor.'),
      close: () => {}
    }
  }
  return ctrl
}
