export interface BsPaginationProps {
  /** Current page, 1-indexed (v-model). */
  modelValue?: number
  /** Total page count. */
  total?: number
}

export interface BsPaginationEmits {
  (e: 'update:modelValue', page: number): void
}
