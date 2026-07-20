import {defineEventHandler, readBody, setResponseStatus} from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {contactNo, password} = body

  const user = MOCK_USERS.find((u) => u.contactNo === contactNo && u.password === password)

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
    data: {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      managerId: user.contactNo,
      managerName: user.profile.staffNm,
      userType: user.profile.userType,
      orgNm: user.profile.orgNm,
      orgNo: user.profile.orgNo,
      roleCd: user.profile.roleCd,
      expiresIn: 1800
    }
  }
})
