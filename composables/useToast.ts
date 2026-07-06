import {inject, provide, ref, type InjectionKey, type Ref} from 'vue'
export const TOAST_TONE_KEYNAME = {
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  NEUTRAL: 'neutral'
} as const
export type ToastTone = (typeof TOAST_TONE_KEYNAME)[keyof typeof TOAST_TONE_KEYNAME]

export interface ToastOptions {
  tone?: (t: typeof TOAST_TONE_KEYNAME) => ToastTone
  title?: string
  message?: string
  /** Auto-dismiss ms; 0 keeps it until closed. @default 3200 */
  duration?: number
}

export interface ToastItem extends Omit<ToastOptions, 'tone'> {
  id: string
  tone: ToastTone
}

export interface ToastController {
  open: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

export const LUMO_TOAST_KEY: InjectionKey<ToastController> = Symbol('lumo-toast')

export interface ToastProviderState {
  items: Ref<ToastItem[]>
}

/** Called by BsToastProvider. Provides { open, dismiss } and returns the reactive list too. */
export function provideToast(): ToastProviderState & ToastController {
  const items = ref<ToastItem[]>([])

  const open: ToastController['open'] = (opts) => {
    const id = Math.random().toString(36).slice(2)
    const {tone, ...params} = opts
    let _tone: ToastTone = TOAST_TONE_KEYNAME.NEUTRAL
    if (tone && typeof tone === 'function') {
      // 'success' | 'danger' | 'warning' | 'info' | 'neutral'
      _tone = tone(TOAST_TONE_KEYNAME)
    }
    items.value.push({id, tone: _tone, ...params})
    const ttl = opts.duration != null ? opts.duration : 3200
    if (ttl > 0) setTimeout(() => dismiss(id), ttl)
    return id
  }
  const dismiss = (id: string) => {
    items.value = items.value.filter((t) => t.id !== id)
  }

  provide(LUMO_TOAST_KEY, {open, dismiss})
  return {items, open, dismiss}
}

/** Returns a controller: toast.open({ tone, title, message, duration }), toast.dismiss(id). */
export function useToast(): ToastController {
  const ctrl = inject(LUMO_TOAST_KEY, null)
  if (!ctrl) {
    return {
      open: () => {
        console.warn('[Lumo] useToast() called without <BsToastProvider> ancestor.')
        return ''
      },
      dismiss: () => {}
    }
  }
  return ctrl
}
