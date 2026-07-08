<script setup lang="ts">
import '~/app/shared.scss'
import './index.style.scss'
import {ref} from 'vue'
import {BsCard, BsBadge, BsTabs} from '~/components/common'
import AppIcon from '~/app/AppIcon/index.vue'
// import {useToast} from '~/composables/useToast'
import {gradeTone, formatWon} from '~/app/data'
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'
import type {SingleResponse, ListResponse} from '~/types/commonResponse'
import type {FavoriteCattleItem, FavoritePartItem, PostRemoveFavoritesReponse} from '~/composables/useFavoritesApi'

const api = useFavoritesApi()
const toast = useToast()
const cattleCols = '1.4fr 0.8fr 1.4fr 60px'
const partCols = '0.9fr 1.1fr 0.8fr 1.4fr 0.8fr 1fr 60px'
const favoriteStore = useFavoritesStore()
const {data: cattleFavorites} = await useAsyncData('pages-favorites-cattle', async () => {
  const res = await api.getFavorites<ListResponse<FavoriteCattleItem>>({type: USER_FAVORITE_TYPE.CATTLE})
  if (res?.success) return res.data
})
const {data: partFavorites} = await useAsyncData('pages-favorites-part', async () => {
  const res = await api.getFavorites<ListResponse<FavoritePartItem>>({type: USER_FAVORITE_TYPE.PART})
  if (res?.success) return res.data
})
const tab = ref(USER_FAVORITE_TYPE.CATTLE)
const tabs = computed(() => [
  {value: USER_FAVORITE_TYPE.CATTLE, label: '소', count: cattleFavorites.value?.length ?? 0},
  {value: USER_FAVORITE_TYPE.PART, label: '부위', count: partFavorites.value?.length ?? 0}
])

async function onClickRemoveFavorites(interestSeq: number) {
  const res = await api.postRemoveFavorites<SingleResponse<PostRemoveFavoritesReponse>>({
    interestSeq
  })
  if (res?.success) {
    toast.open({title: '즐겨찾기에서 제거했어요'})
    if (tab.value === USER_FAVORITE_TYPE.CATTLE) {
      cattleFavorites.value = cattleFavorites.value?.filter((item) => item.interestSeq !== interestSeq)
    } else {
      partFavorites.value = partFavorites.value?.filter((item) => item.interestSeq !== interestSeq)
    }
    favoriteStore.setDecrementCount()
  }
}
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">즐겨찾기</h2>
        <p class="pg__sub">관심 등록한 소와 부위를 모아봤어요</p>
      </div>
    </div>

    <BsCard padding="none">
      <div class="fav__tabs">
        <BsTabs v-model="tab" :tabs="tabs" />
      </div>

      <!-- 소 탭 -->
      <div v-if="tab === USER_FAVORITE_TYPE.CATTLE" class="fav__table">
        <template v-if="cattleFavorites?.length">
          <div class="dt__scroll">
            <div class="dt__table" style="--dt-min: 480px">
              <div class="dt__head" :style="{gridTemplateColumns: cattleCols}">
                <div class="dt__hcell">접수번호</div>
                <div class="dt__hcell">등급</div>
                <div class="dt__hcell">업체</div>
                <div class="dt__hcell" />
              </div>
              <div
                v-for="c in cattleFavorites"
                :key="c.interestSeq"
                class="dt__row"
                :style="{gridTemplateColumns: cattleCols}"
              >
                <div class="dt__cell dt__cell--mono dt__cell--strong">{{ c.receiptNo }}</div>
                <div>
                  <BsBadge :tone="gradeTone(c.gradeCd)">{{ c.gradeCd }}</BsBadge>
                </div>
                <div class="dt__cell dt__cell--muted">{{ c.companyNm }}</div>
                <div style="display: flex; justify-content: flex-end">
                  <button class="fav__remove" aria-label="즐겨찾기 해제" @click="onClickRemoveFavorites(c.interestSeq)">
                    <AppIcon name="heartFilled" :size="17" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty">
          <div class="empty__icon"><AppIcon name="heart" :size="22" /></div>
          <div class="empty__text">즐겨찾기한 소가 없습니다</div>
        </div>
      </div>

      <!-- 부위 탭 -->
      <div v-else class="fav__table">
        <template v-if="partFavorites?.length">
          <div class="dt__scroll">
            <div class="dt__table" style="--dt-min: 720px">
              <div class="dt__head" :style="{gridTemplateColumns: partCols}">
                <div class="dt__hcell">상장번호</div>
                <div class="dt__hcell">부위</div>
                <div class="dt__hcell">등급</div>
                <div class="dt__hcell">업체</div>
                <div class="dt__hcell dt__hcell--right">중량</div>
                <div class="dt__hcell dt__hcell--right">최저가</div>
                <div class="dt__hcell" />
              </div>
              <div
                v-for="p in partFavorites"
                :key="p.interestSeq"
                class="dt__row"
                :style="{gridTemplateColumns: partCols}"
              >
                <div class="dt__cell dt__cell--mono dt__cell--muted">{{ p.listingNo }}</div>
                <div class="dt__cell dt__cell--strong">{{ p.partNm }}</div>
                <div>
                  <BsBadge :tone="gradeTone(p.gradeCd)">{{ p.gradeCd }}</BsBadge>
                </div>
                <div class="dt__cell dt__cell--muted">{{ p.companyNm }}</div>
                <div class="dt__cell dt__cell--num">{{ p.weight }}kg</div>
                <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(p.minPrice) }}</div>
                <div style="display: flex; justify-content: flex-end">
                  <button class="fav__remove" aria-label="즐겨찾기 해제" @click="onClickRemoveFavorites(p.interestSeq)">
                    <AppIcon name="heartFilled" :size="17" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty">
          <div class="empty__icon"><AppIcon name="heart" :size="22" /></div>
          <div class="empty__text">즐겨찾기한 부위가 없습니다</div>
        </div>
      </div>
    </BsCard>
  </div>
</template>
