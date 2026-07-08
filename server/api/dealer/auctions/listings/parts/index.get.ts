import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const page = Number(query.page ?? 0)
  const size = Number(query.size ?? 20)
  const gradeCd = query.gradeCd ? String(query.gradeCd) : ''
  const companyNo = query.companyNo ? String(query.companyNo) : ''
  const keyword = query.keyword ? String(query.keyword).trim() : ''

  const filtered = MOCK_PART_LISTINGS.filter((p) => {
    const gradeMatch = !gradeCd || (gradeCd === '1P' ? p.gradeCd === '1+' : p.gradeCd === gradeCd)
    const companyMatch = !companyNo || p.companyNo === companyNo
    const keywordMatch =
      !keyword ||
      p.partNm.includes(keyword) ||
      p.receiptNo.includes(keyword) ||
      p.companyNm.includes(keyword) ||
      p.listingNo.includes(keyword)
    return gradeMatch && companyMatch && keywordMatch
  })

  const { data, pageInfo } = paginate(filtered, page, size)

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data,
    pageInfo
  }
})
