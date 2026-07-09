import {defineStore} from 'pinia'
import type {SingleResponse} from '~/types/commonResponse'
import type {GetFavoritesCountResponse} from '~/composables/useFavoritesApi'

const api = useFavoritesApi()
export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    cattleCount: 0,
    partCount: 0,
    totalCount: 0
  }),
  actions: {
    /**
     * totalCount init set 함수
     * @param n number
     */
    setTotalCount(n: number) {
      this.totalCount = n
    },
    /**
     * totalCount++
     */
    setIncrementCount() {
      this.totalCount++
    },
    /**
     * totalCount--
     */
    setDecrementCount() {
      this.totalCount--
    },
    /**
     * 즐겨찾기 소,부위 토탈카운트 fetch
     */
    async fetchCount() {
      const res = await api.getFavoritesCount<SingleResponse<GetFavoritesCountResponse>>()
      if (res?.success) {
        this.cattleCount = res.data.cattleCount
        this.partCount = res.data.partCount
        this.totalCount = res.data.totalCount
      }
    }
  }
})
