import type {UserType} from '~/constants/userType'

export interface LoginRequest {
  contactNo: string // 연락처 (로그인 ID)
  password: string
}
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  managerId: string
  managerName: string
  userType: UserType
  orgNm: string
  orgNo: string
  roleCd: string
  expiresIn: number
}
