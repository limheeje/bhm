import {defineEventHandler, getHeader, readMultipartFormData, setResponseStatus} from 'h3'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace(/^Bearer\s+/, '')
  const user = findMockUserByAccessToken(token)

  if (!user) {
    setResponseStatus(event, 401)
    return {success: false, message: '인증이 필요합니다.', httpStatus: 401}
  }

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file')

  if (!file?.data?.length) {
    setResponseStatus(event, 400)
    return {success: false, message: '업로드할 파일이 없습니다.', httpStatus: 400}
  }
  if (!file.type || !ALLOWED_TYPES.includes(file.type)) {
    setResponseStatus(event, 400)
    return {success: false, message: 'PNG, JPG, WEBP 파일만 업로드할 수 있습니다.', httpStatus: 400}
  }
  if (file.data.length > MAX_SIZE) {
    setResponseStatus(event, 400)
    return {success: false, message: '파일 크기는 5MB를 넘을 수 없습니다.', httpStatus: 400}
  }

  // mock 환경: 실제 파일 스토리지가 없어 base64 data URL로 대체 (실서버 연동 시 업로드 후 CDN URL 반환으로 교체)
  const profileImgUrl = `data:${file.type};base64,${file.data.toString('base64')}`
  user.profile.profileImgUrl = profileImgUrl

  return {success: true, message: '', httpStatus: 200, data: {profileImgUrl}}
})
