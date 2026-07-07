export interface BsSkeletonProps {
  /** @default '100%' */
  width?: string | number
  /** @default '14px' */
  height?: string | number
  /** Border radius (ignored when `circle` is true). @default 'var(--radius-sm)' */
  radius?: string
  /** Renders a perfect circle — for avatars/icons. @default false */
  circle?: boolean
}
