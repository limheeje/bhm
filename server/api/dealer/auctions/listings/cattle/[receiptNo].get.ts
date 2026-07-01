import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  const receiptNo = getRouterParam(event, 'receiptNo') as string
  const detail = MOCK_CATTLE_DETAILS[receiptNo]

  if (!detail) {
    setResponseStatus(event, 404)
    return {
      success: false,
      message: '해당 경매 정보를 찾을 수 없습니다.',
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
