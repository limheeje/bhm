export type BsMenuAlign = 'start' | 'end'

export interface BsMenuItem {
  label?: string
  /** Click handler. */
  onClick?: () => void
  /** Icon as an HTML string (rendered with v-html) or omit and use plain label. */
  icon?: string
  shortcut?: string
  /** 'danger' renders the destructive style. */
  tone?: 'default' | 'danger'
  /** Render a divider line (ignores other fields). */
  divider?: boolean
  /** Render a non-interactive section heading. */
  heading?: boolean
}

export interface BsDropdownMenuProps {
  items?: BsMenuItem[]
  /** Horizontal alignment to the trigger. @default 'start' */
  align?: BsMenuAlign
  /** Menu min-width in px. @default 200 */
  width?: number
}
