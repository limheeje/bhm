export interface GetBidsListParams {
  page?: number //0-based, 기본 0
  size?: number // 기본 10
  startDate?: string // 'YYYY-MM-DD', 시작일 (미입력 시 전체)
  endDate?: string //'YYYY-MM-DD', 종료일 (미입력 시 전체)
  hideUnsold?: string // 'true'일 때만 유찰 건 제외 (그 외엔 전체 포함)
}
export interface GetBidsListResponse {
  bidSeq: number // 낙찰 고유번호
  receiptNo: string // 접수번호 (어느 소인지)
  partNm: string // 부위명
  gradeCd: string // 등급 ('1+' | '1' | '2' | '3')
  companyNm: string // 상장업체명
  genderCd: 'STEER' | 'COW' // 성별
  weight: number // 중량 (kg)
  bidPrice: number // 낙찰가 (unsoldYn === 'Y'면 0)
  bidDt: string // 'YYYY-MM-DD HH:mm', 낙찰일시
  unsoldYn: 'Y' | 'N' // 유찰 여부
}
export interface getBidsParams {
  page?: number
  size?: number
}
export interface getBidsResponse {
  companyNm: string //상장업체명
  genderCd: 'STEER' | 'COW' //성별 코드 (거세우/암소)
  partNm: string //부위명
  bidSeq: number //낙찰 순번
  receiptNo: string //접수번호
  gradeCd: string //등급
  weight: number //중량(kg)
  bidPrice: number //낙찰가
}
export interface getBidsSummaryResponse {
  totalCount: number //총 낙찰 건수
  totalAmount: number //총 낙찰 금액
  totalWeight: number //총 중량
  avgPrice: number //평균 단가
}
export const BASE_URL = `/dealer`
export const BASE_BIDS_URL = `${BASE_URL}/auctions/bids`
export const BASE_BIDS_SUMMARY_URL = `${BASE_URL}/auctions/bids/summary`

export const useBidsApi = () => {
  /**
   * @method get
   * @path /dealer/auctions/bids
   * @response PaginationResponse<getBidsResponse>
   */
  const getBids = async <T>(params?: getBidsParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_BIDS_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * @method get
   * @path /dealer/auctions/bids/summary
   * @response SingleResponse<getBidsSummaryResponse>
   */
  const getBidsSummary = async <T>(): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_BIDS_SUMMARY_URL)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * 경락내역 조회
   * @method get
   * @path /dealer/auctions/bids
   * @response PaginationResponse<GetBidsListResponse>
   */
  const getList = async <T>(params?: GetBidsListParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_BIDS_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getList,
    getBids,
    getBidsSummary
  }
}
