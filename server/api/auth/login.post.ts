import { defineEventHandler, readBody, setResponseStatus } from 'h3'

const MOCK_USERS = [
  {
    contactNo: '010-1111-1111',
    password: 'admin1234',
    data: {
      accessToken: 'mock-access-token-admin',
      refreshToken: 'mock-refresh-token-admin',
      managerId: '010-1111-1111',
      managerName: '관리자',
      userType: 'ADMIN',
      orgNm: '중앙도매시장',
      orgNo: '001',
      roleCd: 'MASTER_ADMIN',
      expiresIn: 1800
    }
  },
  {
    contactNo: '010-2222-2222',
    password: 'company1234',
    data: {
      accessToken: 'mock-access-token-company',
      refreshToken: 'mock-refresh-token-company',
      managerId: '010-2222-2222',
      managerName: '업체담당자',
      userType: 'COMPANY',
      orgNm: '한우상장업체',
      orgNo: '002',
      roleCd: 'COMPANY_ADMIN',
      expiresIn: 1800
    }
  },
  {
    contactNo: '010-3333-3333',
    password: 'dealer1234',
    data: {
      accessToken: 'mock-access-token-dealer',
      refreshToken: 'mock-refresh-token-dealer',
      managerId: '010-3333-3333',
      managerName: '중도매인',
      userType: 'DEALER',
      orgNm: '○○중도매',
      orgNo: '003',
      roleCd: 'DEALER',
      expiresIn: 1800
    }
  }
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { contactNo, password } = body

  const user = MOCK_USERS.find(u => u.contactNo === contactNo && u.password === password)

  if (!user) {
    setResponseStatus(event, 401)
    return {
      success: false,
      message: '아이디 또는 비밀번호가 일치하지 않습니다.',
      httpStatus: 401,
      code: 'INVALID_CREDENTIALS'
    }
  }

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: user.data
  }
})
