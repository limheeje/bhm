import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  const ntceNo = Number(getRouterParam(event, 'ntceNo'))
  const detail = MOCK_NOTICE_DETAILS[ntceNo]

  if (!detail) {
    setResponseStatus(event, 404)
    return {
      success: false,
      message: '공지사항을 찾을 수 없습니다.',
      httpStatus: 404
    }
  }

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: detail
  }
})
