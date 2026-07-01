import type {ToastTone} from '~/composables/useToast'

/** Inline SVG inner markup per tone (rendered via v-html inside a 24-box svg). */
export const BS_TOAST_GLYPHS: Record<ToastTone, string> = {
  success: '<path d="M20 6 9 17l-5-5"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
  warning:
    '<path d="M10.3 3.86 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.86a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  neutral: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>'
}
