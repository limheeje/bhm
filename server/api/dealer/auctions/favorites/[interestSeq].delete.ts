import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler((event) => {
  const interestSeq = Number(getRouterParam(event, 'interestSeq'))

  const cattleIdx = MOCK_FAVORITES_CATTLE.findIndex((f) => f.interestSeq === interestSeq)
  if (cattleIdx !== -1) {
    const [removed] = MOCK_FAVORITES_CATTLE.splice(cattleIdx, 1)

    const cattle = MOCK_CATTLE_LIST.find((c) => c.receiptNo === removed.receiptNo)
    if (cattle) {
      cattle.favorite = false
      cattle.interestSeq = undefined
    }
    const detail = MOCK_CATTLE_DETAILS[removed.receiptNo] as
      | { favorite?: boolean; interestSeq?: number | null }
      | undefined
    if (detail) {
      detail.favorite = false
      detail.interestSeq = null
    }

    return { success: true, message: '', httpStatus: 200, data: null }
  }

  const partIdx = MOCK_FAVORITES_PART.findIndex((f) => f.interestSeq === interestSeq)
  if (partIdx !== -1) {
    const [removed] = MOCK_FAVORITES_PART.splice(partIdx, 1)

    for (const detail of Object.values(MOCK_CATTLE_DETAILS) as {parts?: Record<string, any>[]}[]) {
      const part = detail.parts?.find((p) => p.listingNo === removed.listingNo)
      if (part) {
        part.favorite = false
        part.interestSeq = undefined
        break
      }
    }

    return { success: true, message: '', httpStatus: 200, data: null }
  }

  setResponseStatus(event, 404)
  return { success: false, message: '즐겨찾기 정보를 찾을 수 없습니다.', httpStatus: 404 }
})
