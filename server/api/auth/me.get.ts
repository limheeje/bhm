import {defineEventHandler, getHeader, setResponseStatus} from 'h3'

export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/, '')
  const user = findMockUserByAccessToken(token)

  if (!user) {
    setResponseStatus(event, 401)
    return {success: false, message: '인증이 필요합니다.', httpStatus: 401}
  }

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: {...user.profile}
  }
})
