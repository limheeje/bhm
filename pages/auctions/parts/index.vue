<script setup lang="ts">
import '~/app/shared.scss'
import '~/pages/auctions/index.style.scss'
import {ref} from 'vue'
import {BsCard, BsBadge, BsButton, BsSelect, BsInput, BsPagination} from '~/components/common'
import AppIcon from '~/app/AppIcon/index.vue'
import {gradeTone, formatWon} from '~/app/data'
import type {SingleResponse, PaginationResponse} from '~/types/commonResponse'
import type {FilterOptionsResponse, PartListingResponse} from '~/composables/useAuctionsApi'
import type {PostAddFavoritesReponse, PostRemoveFavoritesReponse} from '~/composables/useFavoritesApi'
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'
import _ from 'lodash'

const cols = '40px 1fr 1.1fr 1fr 0.7fr 1.2fr 0.8fr 0.9fr'
const grade = ref('')
const company = ref('')
const keyword = ref('')
const currentPage = ref(1)
const api = useAuctionsApi()
const favoritesApi = useFavoritesApi()
const favoriteStore = useFavoritesStore()
const debounceKeyword = ref('')
const updateDebounceKeyword = _.debounce((v: string) => {
  debounceKeyword.value = v
}, 500)
watch(
  () => keyword.value,
  (v) => updateDebounceKeyword(v)
)

function resetFilters() {
  grade.value = ''
  company.value = ''
  keyword.value = ''
}

const {data} = await useAsyncData('pages-auctions-parts-filter-options', async () => {
  try {
    const res = await api.getFilterOptions<SingleResponse<FilterOptionsResponse>>()
    if (res?.success) return res?.data
  } catch (err) {
    console.log(err)
  }
})

const {data: localList} = await useAsyncData(
  'pages-auctions-parts-list',
  async () => {
    try {
      const res = await api.getPartsList<PaginationResponse<PartListingResponse>>({
        page: currentPage.value - 1,
        size: 10,
        gradeCd: grade.value,
        companyNo: company.value,
        keyword: debounceKeyword.value
      })
      if (res?.success)
        return {
          data: res.data,
          pageInfo: res.pageInfo
        }
    } catch (err) {
      console.log(err)
    }
  },
  {
    watch: [debounceKeyword, currentPage, grade, company]
  }
)

async function onClickFavoritesToggle(item: PartListingResponse) {
  const {favorite, receiptNo, listingNo} = item
  if (!favorite) {
    const res = await favoritesApi.postAddFavorites<SingleResponse<PostAddFavoritesReponse>>({
      receiptNo,
      listingNo,
      type: USER_FAVORITE_TYPE.PART
    })
    if (res?.success) {
      item.favorite = true
      item.interestSeq = res.data.interestSeq
      favoriteStore.setIncrementCount()
    }
  } else {
    const res = await favoritesApi.postRemoveFavorites<SingleResponse<PostRemoveFavoritesReponse>>({
      interestSeq: item.interestSeq as number
    })
    if (res?.success) {
      item.favorite = false
      favoriteStore.setDecrementCount()
    }
  }
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">경매 · 부위 목록</h2>
        <p class="pg__sub">상장된 부위를 등급·업체로 조회하고 즐겨찾기하세요</p>
      </div>
      <div class="pg__actions">
        <BsBadge tone="info" dot>{{ localList?.pageInfo.totalElements }}건 조회됨</BsBadge>
      </div>
    </div>
    <BsCard padding="none">
      <!-- 필터 / 검색 -->
      <div class="auc__toolbar">
        <div class="auc__filters">
          <div class="auc__filter">
            <BsSelect v-model="grade" :options="data?.grades" placeholder="전체 등급" />
          </div>
          <div class="auc__filter">
            <BsSelect v-model="company" :options="data?.companies" placeholder="전체 업체" />
          </div>
          <div class="auc__search">
            <BsInput v-model="keyword" placeholder="부위·접수번호·업체 검색">
              <template #lead><AppIcon name="search" :size="15" /></template>
            </BsInput>
          </div>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="auc__table">
        <div class="dt__scroll">
          <div class="dt__table" style="--dt-min: 860px">
            <div class="dt__head" :style="{gridTemplateColumns: cols}">
              <div class="dt__hcell" />
              <div class="dt__hcell">상장번호</div>
              <div class="dt__hcell">접수번호</div>
              <div class="dt__hcell">부위</div>
              <div class="dt__hcell">등급</div>
              <div class="dt__hcell">업체</div>
              <div class="dt__hcell dt__hcell--right">중량</div>
              <div class="dt__hcell dt__hcell--right">최저가</div>
            </div>

            <div v-for="p in localList?.data" :key="p.listingNo" class="dt__row" :style="{gridTemplateColumns: cols}">
              <button
                class="auc__fav"
                :class="{'auc__fav--on': p.favorite}"
                :aria-label="p.favorite ? '즐겨찾기 해제' : '즐겨찾기'"
                @click="onClickFavoritesToggle(p)"
              >
                <AppIcon :name="p.favorite ? 'heartFilled' : 'heart'" :size="17" />
              </button>
              <div class="dt__cell dt__cell--mono dt__cell--strong">{{ p.listingNo }}</div>
              <div class="dt__cell dt__cell--mono dt__cell--muted">{{ p.receiptNo }}</div>
              <div class="dt__cell dt__cell--strong">{{ p.partNm }}</div>
              <div>
                <BsBadge :tone="gradeTone(p.gradeCd)">{{ p.gradeCd }}</BsBadge>
              </div>
              <div class="dt__cell dt__cell--muted">{{ p.companyNm }}</div>
              <div class="dt__cell dt__cell--num">{{ p.weight.toFixed(1) }}kg</div>
              <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(p.minPrice) }}</div>
            </div>
          </div>
        </div>

        <div v-if="!localList?.data.length" class="empty">
          <div class="empty__icon"><AppIcon name="search" :size="22" /></div>
          <div class="empty__text">조건에 맞는 부위가 없습니다</div>
          <BsButton variant="secondary" size="sm" @click="resetFilters">필터 초기화</BsButton>
        </div>

        <div class="dt__foot">
          <span class="dt__foot-count" />
          <BsPagination v-model="currentPage" :total="localList?.pageInfo.totalPages" />
        </div>
      </div>
    </BsCard>
  </div>
</template>
