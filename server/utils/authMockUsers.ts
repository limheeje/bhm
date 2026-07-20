export interface MockUserProfile {
  staffContactNo: string
  staffNm: string
  email: string
  profileImgUrl: string | null
  userType: 'ADMIN' | 'COMPANY' | 'DEALER'
  orgNm: string
  orgNo: string
  roleCd: string
  lastLoginDt: string
  lastLoginIp: string
}

export interface MockUser {
  contactNo: string
  password: string
  accessToken: string
  refreshToken: string
  profile: MockUserProfile
}

export const MOCK_USERS: MockUser[] = [
  {
    contactNo: '010-1111-1111',
    password: 'admin1234',
    accessToken: 'mock-access-token-admin',
    refreshToken: 'mock-refresh-token-admin',
    profile: {
      staffContactNo: '010-1111-1111',
      staffNm: '관리자',
      email: 'admin@lumo.io',
      profileImgUrl: null,
      userType: 'ADMIN',
      orgNm: '중앙도매시장',
      orgNo: '001',
      roleCd: 'MASTER_ADMIN',
      lastLoginDt: '2026-06-29T09:00:00',
      lastLoginIp: '127.0.0.1'
    }
  },
  {
    contactNo: '010-2222-2222',
    password: 'company1234',
    accessToken: 'mock-access-token-company',
    refreshToken: 'mock-refresh-token-company',
    profile: {
      staffContactNo: '010-2222-2222',
      staffNm: '업체담당자',
      email: 'company@lumo.io',
      profileImgUrl: null,
      userType: 'COMPANY',
      orgNm: '한우상장업체',
      orgNo: '002',
      roleCd: 'COMPANY_ADMIN',
      lastLoginDt: '2026-06-29T09:00:00',
      lastLoginIp: '127.0.0.1'
    }
  },
  {
    contactNo: '010-3333-3333',
    password: 'dealer1234',
    accessToken: 'mock-access-token-dealer',
    refreshToken: 'mock-refresh-token-dealer',
    profile: {
      staffContactNo: '010-3333-3333',
      staffNm: '중도매인',
      email: 'dealer@lumo.io',
      profileImgUrl: null,
      userType: 'DEALER',
      orgNm: '○○중도매',
      orgNo: '003',
      roleCd: 'DEALER',
      lastLoginDt: '2026-06-29T09:00:00',
      lastLoginIp: '127.0.0.1'
    }
  }
]

export function findMockUserByAccessToken(token: string | undefined | null): MockUser | undefined {
  if (!token) return undefined
  return MOCK_USERS.find((u) => u.accessToken === token)
}
