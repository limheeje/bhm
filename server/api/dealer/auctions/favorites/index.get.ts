import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const list = query.type === 'PART' ? MOCK_FAVORITES_PART : MOCK_FAVORITES_CATTLE

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: list
  }
})
