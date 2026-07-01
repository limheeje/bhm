export type BsCardPadding = 'none' | 'sm' | 'md'

export interface BsCardProps {
  title?: string
  subtitle?: string
  /** Body padding. @default 'md' */
  padding?: BsCardPadding
}
