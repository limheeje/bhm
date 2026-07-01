export type BsBadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'
export type BsBadgeSize = 'sm' | 'md'

export interface BsBadgeProps {
  /** Color intent. @default 'neutral' */
  tone?: BsBadgeTone
  /** Leading status dot. @default false */
  dot?: boolean
  /** @default 'md' */
  size?: BsBadgeSize
}
