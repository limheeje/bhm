export type BsIconButtonVariant = 'ghost' | 'secondary' | 'primary'
export type BsIconButtonSize = 'sm' | 'md' | 'lg'

export interface BsIconButtonProps {
  /** @default 'ghost' */
  variant?: BsIconButtonVariant
  /** @default 'md' */
  size?: BsIconButtonSize
  disabled?: boolean
  /** Accessible label — required, there is no visible text. */
  ariaLabel?: string
}

export interface BsIconButtonEmits {
  (e: 'click', event: MouseEvent): void
}
