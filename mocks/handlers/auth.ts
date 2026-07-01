import {http, HttpResponse} from 'msw'

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
    contactNo: '010-1111-2222',
    password: '1234',
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

export const authHandlers = [
  http.post('/api/auth/login', async ({request}) => {
    const body = (await request.json()) as {contactNo: string; password: string}
    const user = MOCK_USERS.find((u) => u.contactNo === body.contactNo && u.password === body.password)

    if (!user) {
      return HttpResponse.json(
        {success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.', httpStatus: 401},
        {status: 401}
      )
    }

    return HttpResponse.json({success: true, message: '', httpStatus: 200, data: user.data})
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({success: true, message: '', httpStatus: 200, data: 'OK'})
  }),

  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({success: true, message: '', httpStatus: 200})
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      message: '',
      httpStatus: 200,
      data: {
        staffContactNo: '010-1111-1111',
        staffNm: '관리자',
        userType: 'ADMIN',
        orgNm: '중앙도매시장',
        orgNo: '001',
        roleCd: 'MASTER_ADMIN',
        lastLoginDt: '2026-06-29T09:00:00',
        lastLoginIp: '127.0.0.1'
      }
    })
  })
]
