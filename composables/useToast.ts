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
  /** 색/의미 톤. `(t) => t.SUCCESS`처럼 넘겨받은 키 중 하나를 리턴. @default 'neutral' */
  tone?: (t: typeof TOAST_TONE_KEYNAME) => ToastTone
  /** 굵게 표시되는 제목 */
  title?: string
  /** 제목 아래 보조 설명 (선택) */
  message?: string
  /** Auto-dismiss ms; 0이면 닫기 전까지 유지. @default 3200 */
  duration?: number
}

export interface ToastItem extends Omit<ToastOptions, 'tone'> {
  id: string
  tone: ToastTone
}

export interface ToastController {
  /**
   * 토스트를 띄웁니다. 반환값(id)으로 `dismiss(id)` 호출 가능.
   * @example
   * toast.open({ tone: (t) => t.SUCCESS, title: '저장 완료', message: '변경사항이 저장됐어요.' })
   */
  open: (options: ToastOptions) => string
  /** 특정 토스트를 즉시 닫습니다. `open()`이 반환한 id를 넘기세요. */
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
