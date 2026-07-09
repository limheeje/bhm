type FilterOption = {
  label: string
  value: string
}
export interface FilterOptionsResponse {
  grades: FilterOption[]
  companies: FilterOption[]
}
export interface CattleListParams {
  page?: number // 0-based, 기본 0
  size?: number // 기본 20
  gradeCd?: string // '' | '1P'(=1+) | '1' | '2' | '3'
  companyNo?: string // '' | '001' | '002'
  keyword?: string // 접수번호/업체명 부분일치 검색
}
export interface CattleListResponse {
  receiptNo: string
  breedCd: string
  genderCd: 'STEER' | 'COW'
  gradeCd: string
  marblingGrade: string
  monthAge: number
  carcassWt: number
  companyNo: string
  companyNm: string
  partCount: number
  favorite: boolean
  interestSeq?: number
}

export interface PartListingParams {
  page?: number // 0-based, 기본 0
  size?: number // 기본 20
  gradeCd?: string // '' | '1P'(=1+) | '1' | '2' | '3'
  companyNo?: string // '' | '001' | '002'
  keyword?: string // 부위명/접수번호/업체명 부분일치 검색
}
export interface PartListingResponse {
  listingNo: string
  partCd: string
  partNm: string
  weight: number
  minPrice: number
  listedYn: 'Y' | 'N'
  receiptNo: string
  gradeCd: string
  companyNo: string
  companyNm: string
  favorite: boolean
  interestSeq?: number
}
export interface CattleDetailResponse {
  receiptNo: string // 접수번호
  breedCd: string // 품종 코드 (예: 'HANWOO')
  genderCd: 'STEER' | 'COW' // 성별
  gradeCd: string // 등급 ('1+' | '1' | '2' | '3')
  marblingGrade: string // 근내지방도 (예: 'BMS9')
  monthAge: number // 월령
  carcassWt: number // 도체중 (kg)
  companyNo: string // 상장업체 번호
  companyNm: string // 상장업체명
  favorite: boolean // 이 소 자체의 즐겨찾기 여부
  interestSeq: number | null // 즐겨찾기 등록 시 발급된 seq (없으면 null)
  parts: {
    listingNo: string // 부위 상장번호 (예: 'L-001-001')
    partCd: string // 부위 코드 (예: 'TEND')
    partNm: string // 부위명 (예: '안심')
    weight: number // 부위 중량 (kg)
    minPrice: number // 최저가
    listedYn: 'Y' | 'N' // 상장 여부
    favorite?: boolean // 부위별 즐겨찾기 여부
    interestSeq?: number | null // 부위 즐겨찾기 등록 시 seq
  }[]
}

export const BASE_URL = `/dealer/auctions`
export const BASE_FILTER_OPTIONS_URL = `${BASE_URL}/filter-options`
export const BASE_LIST_CATTLE_URL = `${BASE_URL}/listings/cattle`
export const BASE_LIST_PARTS_URL = `${BASE_URL}/listings/parts`
export const useAuctionsApi = () => {
  /**
   * 필터옵션
   * @method get
   * @path /dealer/auctions/filter-options
   * @response SingleResponse<FilterOptionsResponse>
   */
  const getFilterOptions = async <T>(): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_FILTER_OPTIONS_URL)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * 필터옵션
   * @method get
   * @path /dealer/auctions/listings/cattle
   * @response PaginationResponse<CattleListResponse>
   */
  const getCattleList = async <T>(params?: CattleListParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_LIST_CATTLE_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * 부위 목록
   * @method get
   * @path /dealer/auctions/listings/parts
   * @response PaginationResponse<PartListingResponse>
   */
  const getPartsList = async <T>(params?: PartListingParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_LIST_PARTS_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  /**
   * 소 상세페이지 조회
   * @method get
   * @path /dealer/auctions/listings/cattle/{receiptNo}
   * @response SingleResponse<CattleDetailResponse>
   */
  const getCattleDetail = async <T>(receiptNo: string): Promise<T | null> => {
    try {
      return await useClientFetch.get(`${BASE_LIST_CATTLE_URL}/${receiptNo}`)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getFilterOptions,
    getCattleList,
    getPartsList,
    getCattleDetail
  }
}
