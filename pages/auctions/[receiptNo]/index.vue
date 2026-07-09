<script setup lang="ts">
import {useRoute} from 'vue-router'
import '~/app/shared.scss'
import '~/pages/auctions/index.style.scss'
import './index.style.scss'
import {BsCard, BsBadge} from '~/components/common'
import AppIcon from '~/app/AppIcon/index.vue'
import {gradeTone, formatWon, GENDER_LABEL, BREED_LABEL} from '~/app/data'
import type {SingleResponse} from '~/types/commonResponse'
import type {CattleDetailResponse} from '~/composables/useAuctionsApi'
import type {PostAddFavoritesReponse, PostRemoveFavoritesReponse} from '~/composables/useFavoritesApi'
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'

const route = useRoute()
const receiptNo = route.params.receiptNo as string
const api = useAuctionsApi()
console.log('receiptNo--', typeof receiptNo)

const {data} = await useAsyncData(`pages-auctions-[${receiptNo}]`, async () => {
  const res = await api.getCattleDetail<SingleResponse<CattleDetailResponse>>(receiptNo)
  if (res?.success) return res.data
})
console.log('data---', data)

const partCols = '1fr 1fr 0.7fr 0.9fr 0.8fr 50px'
const favoritesApi = useFavoritesApi()
const favoriteStore = useFavoritesStore()

async function onClickCattleFavoriteToggle() {
  if (!data.value) return
  if (!data.value.favorite) {
    const res = await favoritesApi.postAddFavorites<SingleResponse<PostAddFavoritesReponse>>({
      receiptNo,
      type: USER_FAVORITE_TYPE.CATTLE
    })
    if (res?.success) {
      data.value.favorite = true
      data.value.interestSeq = res.data.interestSeq
      favoriteStore.setIncrementCount()
    }
  } else {
    const res = await favoritesApi.postRemoveFavorites<SingleResponse<PostRemoveFavoritesReponse>>({
      interestSeq: data.value.interestSeq as number
    })
    if (res?.success) {
      data.value.favorite = false
      favoriteStore.setDecrementCount()
    }
  }
}

async function onClickPartFavoriteToggle(part: CattleDetailResponse['parts'][number]) {
  if (!part.favorite) {
    const res = await favoritesApi.postAddFavorites<SingleResponse<PostAddFavoritesReponse>>({
      receiptNo,
      listingNo: part.listingNo,
      type: USER_FAVORITE_TYPE.PART
    })
    if (res?.success) {
      part.favorite = true
      part.interestSeq = res.data.interestSeq
      favoriteStore.setIncrementCount()
    }
  } else {
    const res = await favoritesApi.postRemoveFavorites<SingleResponse<PostRemoveFavoritesReponse>>({
      interestSeq: part.interestSeq as number
    })
    if (res?.success) {
      part.favorite = false
      favoriteStore.setDecrementCount()
    }
  }
}
</script>

<template>
  <div v-if="data" class="pg">
    <div class="pg__head">
      <div>
        <NuxtLink to="/auctions" class="detail__back">‹ 소 목록으로</NuxtLink>
        <h2 class="pg__title">{{ data.receiptNo }}</h2>
        <p class="pg__sub">
          {{ data.companyNm }} · {{ BREED_LABEL[data.breedCd] ?? data.breedCd }} ·
          {{ GENDER_LABEL[data.genderCd] ?? data.genderCd }}
        </p>
      </div>
      <div class="pg__actions">
        <button
          class="auc__fav"
          :class="{'auc__fav--on': data.favorite}"
          :aria-label="data.favorite ? '즐겨찾기 해제' : '즐겨찾기'"
          @click="onClickCattleFavoriteToggle"
        >
          <AppIcon :name="data.favorite ? 'heartFilled' : 'heart'" :size="20" />
        </button>
      </div>
    </div>

    <div class="detail__stack">
      <BsCard title="소 정보">
        <div class="detail__grid">
          <div class="detail__item">
            <div class="detail__label">등급</div>
            <BsBadge :tone="gradeTone(data.gradeCd)">{{ data.gradeCd }}</BsBadge>
          </div>
          <div class="detail__item">
            <div class="detail__label">근내지방도</div>
            <div class="detail__value">{{ data.marblingGrade }}</div>
          </div>
          <div class="detail__item">
            <div class="detail__label">월령</div>
            <div class="detail__value">{{ data.monthAge }}개월</div>
          </div>
          <div class="detail__item">
            <div class="detail__label">도체중</div>
            <div class="detail__value">{{ data.carcassWt.toFixed(1) }}kg</div>
          </div>
          <div class="detail__item">
            <div class="detail__label">업체</div>
            <div class="detail__value">{{ data.companyNm }}</div>
          </div>
        </div>
      </BsCard>

      <BsCard title="부위 목록" padding="none">
        <div class="dt__scroll">
          <div class="dt__table" style="--dt-min: 560px">
            <div class="dt__head" :style="{gridTemplateColumns: partCols}">
              <div class="dt__hcell">상장번호</div>
              <div class="dt__hcell">부위</div>
              <div class="dt__hcell dt__hcell--right">중량</div>
              <div class="dt__hcell dt__hcell--right">최저가</div>
              <div class="dt__hcell">상태</div>
              <div class="dt__hcell" />
            </div>
            <div v-for="p in data.parts" :key="p.listingNo" class="dt__row" :style="{gridTemplateColumns: partCols}">
              <div class="dt__cell dt__cell--mono dt__cell--muted">{{ p.listingNo }}</div>
              <div class="dt__cell dt__cell--strong">{{ p.partNm }}</div>
              <div class="dt__cell dt__cell--num">{{ p.weight.toFixed(1) }}kg</div>
              <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(p.minPrice) }}</div>
              <div>
                <BsBadge :tone="p.listedYn === 'Y' ? 'success' : 'neutral'">
                  {{ p.listedYn === 'Y' ? '상장중' : '미상장' }}
                </BsBadge>
              </div>
              <div style="display: flex; justify-content: flex-end">
                <button
                  class="auc__fav"
                  :class="{'auc__fav--on': p.favorite}"
                  :aria-label="p.favorite ? '즐겨찾기 해제' : '즐겨찾기'"
                  @click="onClickPartFavoriteToggle(p)"
                >
                  <AppIcon :name="p.favorite ? 'heartFilled' : 'heart'" :size="17" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!data.parts.length" class="empty">
          <div class="empty__icon"><AppIcon name="search" :size="22" /></div>
          <div class="empty__text">등록된 부위가 없습니다</div>
        </div>
      </BsCard>
    </div>
  </div>

  <div v-else class="pg">
    <div class="empty">
      <div class="empty__icon"><AppIcon name="search" :size="22" /></div>
      <div class="empty__text">해당 경매 정보를 찾을 수 없습니다</div>
      <NuxtLink to="/auctions" class="detail__back">‹ 소 목록으로</NuxtLink>
    </div>
  </div>
</template>
