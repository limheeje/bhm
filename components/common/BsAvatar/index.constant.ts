import type {BsAvatarSize} from './index.type'

/** Pixel diameter per size token. */
export const BS_AVATAR_SIZES: Record<BsAvatarSize, number> = {
  xs: 24,
  sm: 28,
  md: 36,
  lg: 44,
  xl: 56
}

/** Deterministic fallback color pairs (bg / fg) via tokens. */
export const BS_AVATAR_HUES: {bg: string; fg: string}[] = [
  {bg: 'var(--brand-100)', fg: 'var(--brand-700)'},
  {bg: 'var(--success-bg)', fg: 'var(--success-fg)'},
  {bg: 'var(--warning-bg)', fg: 'var(--warning-700)'},
  {bg: 'var(--info-bg)', fg: 'var(--info-fg)'},
  {bg: 'var(--danger-bg)', fg: 'var(--danger-fg)'}
]

export const BS_AVATAR_STATUS_COLORS: Record<string, string> = {
  online: 'var(--success-500)',
  away: 'var(--warning-500)',
  busy: 'var(--danger-500)',
  offline: 'var(--neutral-400)'
}

export function initialsFromName(name: string): string {
  const n = (name || '').trim()
  if (!n) return '?'
  const parts = n.split(/\s+/)
  return (parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function hueIndex(name: string): number {
  let s = 0
  for (let i = 0; i < (name || '').length; i++) s = (s + name.charCodeAt(i)) % BS_AVATAR_HUES.length
  return s
}
