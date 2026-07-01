export const USER_FAVORITE_TYPE = {
  CATTLE: 'CATTLE',
  PART: 'PART'
} as const

export type UserFavoriteType = (typeof USER_FAVORITE_TYPE)[keyof typeof USER_FAVORITE_TYPE]
