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

  return {
    getFilterOptions,
    getCattleList,
    getPartsList
  }
}
