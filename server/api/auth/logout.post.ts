import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    success: true,
    message: '로그아웃 되었습니다.',
    httpStatus: 200,
    data: 'OK'
  }
})
