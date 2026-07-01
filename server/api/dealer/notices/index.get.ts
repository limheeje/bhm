import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 0)
  const size = Number(query.size ?? 20)

  const { data, pageInfo } = paginate(MOCK_NOTICES, page, size)

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data,
    pageInfo
  }
})
