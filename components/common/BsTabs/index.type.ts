export interface BsTabItem {
  value: string
  label: string
  /** Optional count pill. */
  count?: number
}

export interface BsTabsProps {
  /** Active tab value (v-model). */
  modelValue?: string
  /** Tabs as strings or {value,label,count} objects. */
  tabs?: (string | BsTabItem)[]
}

export interface BsTabsEmits {
  (e: 'update:modelValue', value: string): void
}
