export type BsButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-soft'
export type BsButtonSize = 'sm' | 'md' | 'lg'

export interface BsButtonProps {
  /** Visual emphasis. @default 'primary' */
  variant?: BsButtonVariant
  /** Control height. @default 'md' */
  size?: BsButtonSize
  disabled?: boolean
  /** Stretch to fill the container width. @default false */
  fullWidth?: boolean
  /** Native button type. @default 'button' */
  type?: 'button' | 'submit' | 'reset'
}

export interface BsButtonEmits {
  (e: 'click', event: MouseEvent): void
}
