import { defineEventHandler, readBody, setResponseStatus } from 'h3'

interface PostFavoritesBody {
  receiptNo: string
  listingNo?: string
  type: 'CATTLE' | 'PART'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PostFavoritesBody>(event)
  const { receiptNo, listingNo, type } = body

  if (type === 'PART') {
    const detail = MOCK_CATTLE_DETAILS[receiptNo] as { parts?: Record<string, any>[] } | undefined
    const part = detail?.parts?.find((p) => p.listingNo === listingNo)

    if (!part) {
      setResponseStatus(event, 404)
      return { success: false, message: '해당 부위를 찾을 수 없습니다.', httpStatus: 404 }
    }

    const interestSeq = generateFavoriteSeq()
    part.favorite = true
    part.interestSeq = interestSeq

    MOCK_FAVORITES_PART.push({
      interestSeq,
      listingNo: part.listingNo,
      partCd: part.partCd,
      partNm: part.partNm,
      gradeCd: (MOCK_CATTLE_DETAILS[receiptNo] as any)?.gradeCd ?? '',
      companyNm: (MOCK_CATTLE_DETAILS[receiptNo] as any)?.companyNm ?? '',
      weight: part.weight,
      minPrice: part.minPrice
    })

    return { success: true, message: '', httpStatus: 200, data: { interestSeq } }
  }

  const cattle = MOCK_CATTLE_LIST.find((c) => c.receiptNo === receiptNo)
  if (!cattle) {
    setResponseStatus(event, 404)
    return { success: false, message: '해당 경매 정보를 찾을 수 없습니다.', httpStatus: 404 }
  }

  const interestSeq = generateFavoriteSeq()
  cattle.favorite = true
  cattle.interestSeq = interestSeq

  const detail = MOCK_CATTLE_DETAILS[receiptNo] as { favorite?: boolean; interestSeq?: number | null } | undefined
  if (detail) {
    detail.favorite = true
    detail.interestSeq = interestSeq
  }

  MOCK_FAVORITES_CATTLE.push({
    interestSeq,
    receiptNo: cattle.receiptNo,
    gradeCd: cattle.gradeCd,
    companyNm: cattle.companyNm
  })

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: { interestSeq }
  }
})
