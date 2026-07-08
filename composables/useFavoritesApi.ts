export interface FavoriteCattleItem {
  interestSeq: number
  receiptNo: string
  gradeCd: string
  companyNm: string
}
export interface FavoritePartItem {
  interestSeq: number
  listingNo: string
  partCd: string
  partNm: string
  gradeCd: string
  companyNm: string
  weight: number
  minPrice: number
}
export interface PostFavoritesAddParams {
  receiptNo: string
  listingNo?: string // 부위 단위 찜이면 필요, 소 단위면 생략
  type: 'CATTLE' | 'PART'
}
export interface PostAddFavoritesReponse {
  interestSeq: number
}
export interface PostRemoveFavoritesParams {
  interestSeq: number
}
export interface PostRemoveFavoritesReponse {
  null: null
}
export interface GetFavoritesParams {
  type: 'CATTLE' | 'PART'
}
export interface GetFavoritesCountResponse {
  cattleCount: number
  partCount: number
  totalCount: number
}

export const BASE_URL = `/dealer/auctions/favorites`
export const useFavoritesApi = () => {
  /**
   * 즐겨찾기 등록
   * @method post
   * @path /dealer/auctions/favorites
   * @response SingleResponse<PostAddFavoritesReponse>
   */
  const postAddFavorites = async <T>(body: PostFavoritesAddParams): Promise<T | null> => {
    try {
      return await useClientFetch.post<T>(BASE_URL, body)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  /**
   * 즐겨찾기 해제
   * @method delete
   * @path /api/dealer/auctions/favorites/{interestSeq}
   * @response SingleResponse<null>
   */
  const postRemoveFavorites = async <T>(params: PostRemoveFavoritesParams): Promise<T | null> => {
    try {
      return await useClientFetch.delete<T>(`${BASE_URL}/${params.interestSeq}`)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  /**
   * 즐겨찾기 목록 조회
   * @method get
   * @path /dealer/auctions/favorites?type=CATTLE|PART
   * @response ListResponse<T>
   */
  const getFavorites = async <T>(params: GetFavoritesParams): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(BASE_URL, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  /**
   * 즐겨찾기 개수 조회
   * @method get
   * @path /dealer/auctions/favorites/count
   * @response SingleResponse<GetFavoritesCountResponse>
   */
  const getFavoritesCount = async <T>(): Promise<T | null> => {
    try {
      return await useClientFetch.get<T>(`${BASE_URL}/count`)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    postAddFavorites,
    postRemoveFavorites,
    getFavorites,
    getFavoritesCount
  }
}
