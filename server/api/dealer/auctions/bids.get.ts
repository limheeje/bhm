import {defineEventHandler, getQuery} from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 0)
  const size = Number(query.size ?? 10)
  const startDate = query.startDate ? String(query.startDate) : ''
  const endDate = query.endDate ? String(query.endDate) : ''
  const hideUnsold = query.hideUnsold === 'true'

  const filtered = MOCK_BIDS.filter((b) => {
    const bidDate = b.bidDt.slice(0, 10) // 'YYYY-MM-DD HH:mm' -> 'YYYY-MM-DD'
    const startMatch = !startDate || bidDate >= startDate
    const endMatch = !endDate || bidDate <= endDate
    const unsoldMatch = !hideUnsold || b.unsoldYn !== 'Y'
    return startMatch && endMatch && unsoldMatch
  })

  const {data, pageInfo} = paginate(filtered, page, size)

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data,
    pageInfo
  }
})
