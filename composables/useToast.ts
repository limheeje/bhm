import {inject, provide, ref, type InjectionKey, type Ref} from 'vue'

export type ToastTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

export interface ToastOptions {
  tone?: ToastTone
  title?: string
  message?: string
  /** Auto-dismiss ms; 0 keeps it until closed. @default 3200 */
  duration?: number
}

export interface ToastItem extends ToastOptions {
  id: string
}

export type ToastPush = (options: ToastOptions) => string

export const LUMO_TOAST_KEY: InjectionKey<ToastPush> = Symbol('lumo-toast')

export interface ToastController {
  items: Ref<ToastItem[]>
  push: ToastPush
  dismiss: (id: string) => void
}

/** Called by BsToastProvider. Provides the push fn and returns the reactive list. */
export function provideToast(): ToastController {
  const items = ref<ToastItem[]>([])

  const push: ToastPush = (opts) => {
    const id = Math.random().toString(36).slice(2)
    items.value.push({id, tone: 'neutral', ...opts})
    const ttl = opts.duration != null ? opts.duration : 3200
    if (ttl > 0) setTimeout(() => dismiss(id), ttl)
    return id
  }
  const dismiss = (id: string) => {
    items.value = items.value.filter((t) => t.id !== id)
  }

  provide(LUMO_TOAST_KEY, push)
  return {items, push, dismiss}
}

/** Returns a push function: toast({ tone, title, message, duration }). */
export function useToast(): ToastPush {
  const push = inject(LUMO_TOAST_KEY, null)
  if (!push) {
    return () => {
      console.warn('[Lumo] useToast() called without <BsToastProvider> ancestor.')
      return ''
    }
  }
  return push
}
