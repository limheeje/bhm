import type {SingleResponse} from '~/types/commonResponse'
import type {UserFavoriteType} from '~/constants/userFavoriteType'

const BASE_URL = `/dealer/auctions`
const BASE_FILTEROPTIONS = `${BASE_URL}/filter-options`
const BASE_LISTINGS_CATTLE = `${BASE_URL}/listings/cattle`
const BASE_POST_FAVORITES = `${BASE_URL}/favorites`

export interface FilterOption {
  label: string
  value: string
}

export interface GetFilterOptionsParams {
  auctionDate?: string // 'YYYY-MM-DD' (기본값: 오늘)
  round?: number // 회차 (선택)
}
export interface GetFilterOptionsResponse {
  grades: FilterOption[]
  companies: FilterOption[]
}
export interface GetListingsCattleParams {
  auctionDate?: string // 'YYYY-MM-DD'
  round?: number // 회차
  gradeCd?: string // 등급 필터 (빈 문자열이면 undefined 처리됨)
  companyNo?: string // 업체 필터 (빈 문자열이면 undefined 처리됨)
  page?: number // 1-based (기본값: 1)
  size?: number // 기본값: 20 (하드코딩)
}
export interface CattleListItem {
  receiptNo: string // 접수번호 12자리 (YYMMDD-VVV-NNN 포맷)
  breedCd?: string // 품종 코드
  genderCd: string // 'STEER'(거세) | 'COW'(암) | 기타
  gradeCd: string // 등급 코드
  marblingGrade?: string // 마블링 등급
  monthAge?: number // 월령
  carcassWt?: number // 도체중 (kg, toFixed(1) 표시)
  companyNo: string // 업체 번호
  companyNm: string // 업체명
  partCount: number // 등록된 부위 건수
  favorite: boolean // 찜 여부
  interestSeq?: number // 찜 해제용 ID (미찜이면 undefined)
}
export interface GetListingsCattleResponse {
  list: CattleListItem[]
  total: number // 전체 개체 수 (hasMore 계산용)
  page: number
  size: number
}
export interface PostFavoritesParams {
  receiptNo: string
  listingNo?: string
  type: UserFavoriteType
}
export interface PostFavoritesResponse {
  interestSeq: number
}

export const useAuctionsApi = () => {
  async function getFilterOptions(params: GetFilterOptionsParams) {
    try {
      return await useClientFetch.get<SingleResponse<GetFilterOptionsResponse>>(BASE_FILTEROPTIONS, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async function getListingsCattle(params: GetListingsCattleParams) {
    try {
      return await useClientFetch.get<SingleResponse<GetListingsCattleResponse>>(BASE_LISTINGS_CATTLE, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async function postFavorites(params: PostFavoritesParams) {
    try {
      return await useClientFetch.post<SingleResponse<PostFavoritesResponse>>(BASE_POST_FAVORITES, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getFilterOptions,
    getListingsCattle,
    postFavorites
  }
}
