<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {ref} from 'vue'
import {BsCard, BsBadge, BsButton, BsSelect, BsInput, BsPagination} from '../../components/common'
import AppIcon from '../../app/AppIcon/index.vue'
// import {useToast} from '../../composables/useToast'
import {GENDER_LABEL, BREED_LABEL, gradeTone} from '../../app/data'
import type {SingleResponse, PaginationResponse} from '~/types/commonResponse'
import type {FilterOptionsResponse, CattleListResponse} from '~/composables/useAuctionsApi'
import type {PostAddFavoritesReponse, PostRemoveFavoritesReponse} from '~/composables/useFavoritesApi'
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'
import _ from 'lodash'

const cols = '40px 1.3fr 0.7fr 0.7fr 0.7fr 0.9fr 0.7fr 0.9fr 1.2fr 0.7fr'
const grade = ref('')
const company = ref('')
const keyword = ref('')
const currentPage = ref(1)
const api = useAuctionsApi()
const favoritesApi = useFavoritesApi()
const debounceKeyword = ref('')
const updateDebounceKeyword = _.debounce((v) => {
  debounceKeyword.value = v
}, 500)
const favoriteStore = useFavoritesStore()
const toast = useToast()
function resetFilters() {
  grade.value = ''
  company.value = ''
  keyword.value = ''
}

watch(
  () => keyword.value,
  (v) => {
    updateDebounceKeyword(v)
  }
)
const {data} = useAsyncData('pages-aictopms', async () => {
  try {
    const res = await api.getFilterOptions<SingleResponse<FilterOptionsResponse>>()
    if (res?.success) return res?.data
  } catch (err) {
    console.log(err)
  }
})
const {data: localList} = useAsyncData(
  'pages-aictopms-localList',
  async () => {
    try {
      const res = await api.getCattleList<PaginationResponse<CattleListResponse>>({
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

async function onClickFavoritesToggle(item: CattleListResponse) {
  console.log('item----', item)
  const {favorite, receiptNo} = item
  const type = USER_FAVORITE_TYPE.CATTLE
  if (!favorite) {
    const res = await favoritesApi.postAddFavorites<SingleResponse<PostAddFavoritesReponse>>({
      receiptNo,
      type
    })
    if (res?.success) {
      item.favorite = true
      item.interestSeq = res.data.interestSeq
      favoriteStore.setIncrementCount()
      toast.open({title: '즐겨찾기에서 추가했어요'})
    }
  } else {
    const res = await favoritesApi.postRemoveFavorites<SingleResponse<PostRemoveFavoritesReponse>>({
      interestSeq: item.interestSeq as number
    })
    if (res?.success) {
      item.favorite = false
      favoriteStore.setDecrementCount()
      toast.open({title: '즐겨찾기에서 제거했어요'})
    }
  }
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">경매 · 소 목록</h2>
        <p class="pg__sub">상장된 한우를 등급·업체로 조회하고 즐겨찾기하세요</p>
      </div>
      <div class="pg__actions">
        <BsBadge tone="info" dot>{{ localList?.pageInfo.totalElements }}두 조회됨</BsBadge>
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
            <BsInput v-model="keyword" placeholder="접수번호·업체 검색">
              <template #lead><AppIcon name="search" :size="15" /></template>
            </BsInput>
          </div>
        </div>
      </div>

      <!-- 테이블 -->
      <div class="auc__table">
        <div class="dt__scroll">
          <div class="dt__table" style="--dt-min: 900px">
            <div class="dt__head" :style="{gridTemplateColumns: cols}">
              <div class="dt__hcell" />
              <div class="dt__hcell">접수번호</div>
              <div class="dt__hcell">품종</div>
              <div class="dt__hcell">성별</div>
              <div class="dt__hcell">등급</div>
              <div class="dt__hcell">근내지방</div>
              <div class="dt__hcell dt__hcell--right">월령</div>
              <div class="dt__hcell dt__hcell--right">도체중</div>
              <div class="dt__hcell">업체</div>
              <div class="dt__hcell dt__hcell--right">부위</div>
            </div>

            <div v-for="c in localList?.data" :key="c.receiptNo" class="dt__row" :style="{gridTemplateColumns: cols}">
              <button
                class="auc__fav"
                :class="{'auc__fav--on': c.favorite}"
                :aria-label="c.favorite ? '즐겨찾기 해제' : '즐겨찾기'"
                @click="onClickFavoritesToggle(c)"
              >
                <AppIcon :name="c.favorite ? 'heartFilled' : 'heart'" :size="17" />
              </button>
              <NuxtLink
                :to="{
                  path: `/auctions/${c.receiptNo}`
                }"
                class="dt__cell dt__cell--mono dt__cell--strong"
                >{{ c.receiptNo }}</NuxtLink
              >
              <div class="dt__cell">{{ BREED_LABEL[c.breedCd] ?? c.breedCd }}</div>
              <div class="dt__cell">{{ GENDER_LABEL[c.genderCd] ?? c.genderCd }}</div>
              <div>
                <BsBadge :tone="gradeTone(c.gradeCd)">{{ c.gradeCd }}</BsBadge>
              </div>
              <div class="dt__cell">
                <span class="auc__bms">{{ c.marblingGrade }}</span>
              </div>
              <div class="dt__cell dt__cell--num">{{ c.monthAge }}개월</div>
              <div class="dt__cell dt__cell--num">{{ c.carcassWt.toFixed(1) }}kg</div>
              <div class="dt__cell dt__cell--muted">{{ c.companyNm }}</div>
              <div class="dt__cell dt__cell--num">{{ c.partCount }}부위</div>
            </div>
          </div>
        </div>

        <div v-if="!localList?.data.length" class="empty">
          <div class="empty__icon"><AppIcon name="search" :size="22" /></div>
          <div class="empty__text">조건에 맞는 소가 없습니다</div>
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
