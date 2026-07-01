import type {SingleResponse} from '~/types/commonResponse'

const BASE_URL = `/dealer`
export const BASE_NOTICES = `${BASE_URL}/notices`

export interface GetNoticesParams {
  page?: number
  size?: number
}
export interface GetNoticesResponse {
  list: Record<string, any>[] | null
  page?: number
  total?: number
  size?: number
}
export interface GetNoticesDetailResponse {
  ntceNo: number
  title: string
  content: string
  calendarYm: string
  ntceTargetType: string
  ntceType: string
  pinYn: string
  publishYn: string
  regDt: string
  modDt: string
  regId: string
  regNm: string
}
export const useNoticeApi = () => {
  async function getNoticeList(params: GetNoticesParams): Promise<SingleResponse<GetNoticesResponse> | null> {
    try {
      return await useClientFetch.get<SingleResponse<GetNoticesResponse>>(BASE_NOTICES, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async function getNoticeDetail(
    ntceNo: string | number | undefined
  ): Promise<SingleResponse<GetNoticesDetailResponse> | null> {
    try {
      return await useClientFetch.get<SingleResponse<GetNoticesDetailResponse>>(`${BASE_NOTICES}/${ntceNo}`)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  return {
    getNoticeList,
    getNoticeDetail
  }
}
