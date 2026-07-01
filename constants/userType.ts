export const USER_TYPE = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  DEALER: 'DEALER'
} as const
export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE]
