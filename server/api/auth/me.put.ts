import {defineEventHandler, getHeader, readMultipartFormData, setResponseStatus} from 'h3'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

  if (!parts?.length) {
    setResponseStatus(event, 400)
    return {success: false, message: '변경할 항목이 없습니다.', httpStatus: 400}
  }

  const staffNmPart = parts.find((p) => p.name === 'staffNm')
  const emailPart = parts.find((p) => p.name === 'email')
  const filePart = parts.find((p) => p.name === 'file')

  const staffNm = staffNmPart ? staffNmPart.data.toString('utf-8').trim() : undefined
  const email = emailPart ? emailPart.data.toString('utf-8').trim() : undefined
  const hasFile = !!filePart?.data?.length

  // 1. 반영 전에 모든 필드를 먼저 검증 — 하나라도 실패하면 아무것도 저장하지 않음
  if (staffNmPart && !staffNm) {
    setResponseStatus(event, 400)
    return {success: false, message: '이름을 입력해주세요.', httpStatus: 400}
  }
  if (emailPart && (!email || !EMAIL_PATTERN.test(email))) {
    setResponseStatus(event, 400)
    return {success: false, message: '올바른 이메일 형식이 아닙니다.', httpStatus: 400}
  }
  if (hasFile) {
    if (!filePart!.type || !ALLOWED_TYPES.includes(filePart!.type)) {
      setResponseStatus(event, 400)
      return {success: false, message: 'PNG, JPG, WEBP 파일만 업로드할 수 있습니다.', httpStatus: 400}
    }
    if (filePart!.data.length > MAX_SIZE) {
      setResponseStatus(event, 400)
      return {success: false, message: '파일 크기는 5MB를 넘을 수 없습니다.', httpStatus: 400}
    }
  }

  // 2. 검증을 전부 통과했을 때만 실제로 반영 (로그인한 사람 본인의 프로필에만)
  if (staffNm !== undefined) user.profile.staffNm = staffNm
  if (email !== undefined) user.profile.email = email
  if (hasFile) {
    // mock 환경: 실제 스토리지가 없어 base64 data URL로 대체 (실서버 연동 시 업로드 후 CDN URL 반환으로 교체)
    user.profile.profileImgUrl = `data:${filePart!.type};base64,${filePart!.data.toString('base64')}`
  }

  return {success: true, message: '', httpStatus: 200, data: {...user.profile}}
})
