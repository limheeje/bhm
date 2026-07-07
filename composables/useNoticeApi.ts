export interface getNoticeParams {
  page?: number
  size?: number
}
export interface getNoticeResponse {
  ntceNo: number //공지 번호 (상세 조회 시 경로 파라미터로 사용)
  title: string //제목
  regDt: string //등록일시 (ISO)
  pinYn: 'Y' | 'N' //상단 고정 여부
}
export interface getNoticesDetailParams {
  ntceNo: number //목록에서 클릭한 공지 번호
}
export interface getNoticesDetailResponse {
  ntceNo: number // 공지 번호
  title: string // 제목
  content: string // 본문 (\n 줄바꿈 포함)
  calendarYm: string // 관련 년월 (YYYY-MM)
  ntceTargetType: string // 대상 (ALL 등)
  ntceType: 'GENERAL' | 'SYSTEM' // 공지 유형
  pinYn: 'Y' | 'N' // 상단 고정 여부
  publishYn: 'Y' | 'N' // 게시 여부
  regDt: string // 등록일시 (ISO)
  modDt: string // 수정일시 (ISO)
  regId: string // 등록자 ID
  regNm: string // 등록자 이름
}

export const BASE_URL = `dealer`
export const BASE_NOTICES_URL = `${BASE_URL}/notices`
export const useNoticeApi = () => {
  /**
   * 목록조회
   * @method GET
   * @path dealer/notices
   * @response 타입 PaginationResponse<getNoticeResponse>
   */
  const getNotices = async <T>(params?: getNoticeParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_NOTICES_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * 목록 상세조회
   * @method get
   * @path /dealer/notices/{ntceNo}
   * @response SingleResponse<getNoticesDetailResponse>
   */
  const getNoticesDetail = async <T>({ntceNo}: getNoticesDetailParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(`${BASE_NOTICES_URL}/${ntceNo}`)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getNotices,
    getNoticesDetail
  }
}
