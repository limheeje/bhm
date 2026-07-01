import type {ListResponse} from '~/types/commonResponse'
import type {UserFavoriteType} from '~/constants/userFavoriteType'

const BASE_URL = `/dealer/auctions`
const BASE_FAVORITES = `${BASE_URL}/favorites`

export interface GetFavoritesParams {
  type: UserFavoriteType //Cattle | Part
}
export interface GetFavoritesCattleResponse {
  interestSeq: number
  receiptNo: string
  gradeCd?: string
  companyNm?: string
}
export interface GetFavoritesPartResponse {
  interestSeq: number
  listingNo: string
  partCd: string
  partNm: string
  gradeCd?: string
  companyNm?: string
  weight: number
  minPrice: number
}
export const useFavoritesApi = () => {
  async function getFavorites(params: GetFavoritesParams) {
    try {
      return await useClientFetch.get<ListResponse<GetFavoritesCattleResponse | GetFavoritesPartResponse>>(
        BASE_FAVORITES,
        params
      )
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getFavorites
  }
}
