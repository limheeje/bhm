export type BsAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BsAvatarStatus = 'online' | 'away' | 'busy' | 'offline'

export interface BsAvatarProps {
  /** Full name — drives initials and fallback color. */
  name?: string
  /** Image URL; falls back to initials when absent. */
  src?: string
  /** @default 'md' */
  size?: BsAvatarSize
  /** Presence indicator dot. */
  status?: BsAvatarStatus
}
