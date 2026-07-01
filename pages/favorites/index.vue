<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {computed, ref} from 'vue'
import {BsCard, BsBadge, BsTabs} from '../../components/common'
import AppIcon from '../../app/AppIcon/index.vue'
import {useToast} from '../../composables/useToast'
import {FAVORITES_CATTLE, FAVORITES_PART, gradeTone, formatWon} from '../../app/data'

const toast = useToast()

const cattle = ref(FAVORITES_CATTLE.map((c) => ({...c})))
const parts = ref(FAVORITES_PART.map((p) => ({...p})))

const tab = ref('cattle')
const tabs = computed(() => [
  {value: 'cattle', label: '소', count: cattle.value.length},
  {value: 'part', label: '부위', count: parts.value.length}
])

function removeCattle(seq: number) {
  cattle.value = cattle.value.filter((c) => c.interestSeq !== seq)
  toast({title: '즐겨찾기에서 제거했어요'})
}
function removePart(seq: number) {
  parts.value = parts.value.filter((p) => p.interestSeq !== seq)
  toast({title: '즐겨찾기에서 제거했어요'})
}

const cattleCols = '1.4fr 0.8fr 1.4fr 60px'
const partCols = '0.9fr 1.1fr 0.8fr 1.4fr 0.8fr 1fr 60px'
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
      <div v-if="tab === 'cattle'" class="fav__table">
        <template v-if="cattle.length">
          <div class="dt__scroll">
            <div class="dt__table" style="--dt-min: 480px">
              <div class="dt__head" :style="{gridTemplateColumns: cattleCols}">
                <div class="dt__hcell">접수번호</div>
                <div class="dt__hcell">등급</div>
                <div class="dt__hcell">업체</div>
                <div class="dt__hcell" />
              </div>
              <div v-for="c in cattle" :key="c.interestSeq" class="dt__row" :style="{gridTemplateColumns: cattleCols}">
                <div class="dt__cell dt__cell--mono dt__cell--strong">{{ c.receiptNo }}</div>
                <div>
                  <BsBadge :tone="gradeTone(c.gradeCd)">{{ c.gradeCd }}</BsBadge>
                </div>
                <div class="dt__cell dt__cell--muted">{{ c.companyNm }}</div>
                <div style="display: flex; justify-content: flex-end">
                  <button class="fav__remove" aria-label="즐겨찾기 해제" @click="removeCattle(c.interestSeq)">
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
        <template v-if="parts.length">
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
              <div v-for="p in parts" :key="p.interestSeq" class="dt__row" :style="{gridTemplateColumns: partCols}">
                <div class="dt__cell dt__cell--mono dt__cell--muted">{{ p.listingNo }}</div>
                <div class="dt__cell dt__cell--strong">{{ p.partNm }}</div>
                <div>
                  <BsBadge :tone="gradeTone(p.gradeCd)">{{ p.gradeCd }}</BsBadge>
                </div>
                <div class="dt__cell dt__cell--muted">{{ p.companyNm }}</div>
                <div class="dt__cell dt__cell--num">{{ p.weight.toFixed(1) }}kg</div>
                <div class="dt__cell dt__cell--num dt__cell--strong">{{ formatWon(p.minPrice) }}</div>
                <div style="display: flex; justify-content: flex-end">
                  <button class="fav__remove" aria-label="즐겨찾기 해제" @click="removePart(p.interestSeq)">
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
