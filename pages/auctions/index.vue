<script setup lang="ts">
import '../../app/shared.scss'
import './index.style.scss'
import {computed, reactive, ref} from 'vue'
import {BsCard, BsBadge, BsButton, BsSelect, BsInput, BsPagination} from '../../components/common'
import AppIcon from '../../app/AppIcon/index.vue'
import {useToast} from '../../composables/useToast'
import {
  CATTLE_LIST,
  FILTER_OPTIONS,
  GENDER_LABEL,
  BREED_LABEL,
  gradeTone,
  formatNumber,
  type CattleRow
} from '../../app/data'

const toast = useToast()

const rows = reactive(CATTLE_LIST.map((c) => ({...c})))
const grade = ref('')
const company = ref('')
const keyword = ref('')
const page = ref(1)

const filtered = computed(() =>
  rows.filter((c) => {
    const gradeMatch = !grade.value || (grade.value === '1P' ? c.gradeCd === '1+' : c.gradeCd === grade.value)
    const companyMatch = !company.value || c.companyNo === company.value
    const kw = keyword.value.trim()
    const kwMatch = !kw || c.receiptNo.includes(kw) || c.companyNm.includes(kw)
    return gradeMatch && companyMatch && kwMatch
  })
)

function toggleFav(c: CattleRow) {
  c.favorite = !c.favorite
  toast({
    tone: c.favorite ? 'success' : 'neutral',
    title: c.favorite ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 제거했어요',
    message: c.receiptNo
  })
}
function resetFilters() {
  grade.value = ''
  company.value = ''
  keyword.value = ''
}

const cols = '40px 1.3fr 0.7fr 0.7fr 0.7fr 0.9fr 0.7fr 0.9fr 1.2fr 0.7fr'
</script>

<template>
  <div class="pg">
    <div class="pg__head">
      <div>
        <h2 class="pg__title">경매 · 소 목록</h2>
        <p class="pg__sub">상장된 한우를 등급·업체로 조회하고 즐겨찾기하세요</p>
      </div>
      <div class="pg__actions">
        <BsBadge tone="info" dot>{{ filtered.length }}두 조회됨</BsBadge>
      </div>
    </div>

    <BsCard padding="none">
      <!-- 필터 / 검색 -->
      <div class="auc__toolbar">
        <div class="auc__filters">
          <div class="auc__filter">
            <BsSelect v-model="grade" :options="FILTER_OPTIONS.grades" placeholder="전체 등급" />
          </div>
          <div class="auc__filter">
            <BsSelect v-model="company" :options="FILTER_OPTIONS.companies" placeholder="전체 업체" />
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

            <div v-for="c in filtered" :key="c.receiptNo" class="dt__row" :style="{gridTemplateColumns: cols}">
              <button
                class="auc__fav"
                :class="{'auc__fav--on': c.favorite}"
                :aria-label="c.favorite ? '즐겨찾기 해제' : '즐겨찾기'"
                @click="toggleFav(c)"
              >
                <AppIcon :name="c.favorite ? 'heartFilled' : 'heart'" :size="17" />
              </button>
              <div class="dt__cell dt__cell--mono dt__cell--strong">{{ c.receiptNo }}</div>
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

        <div v-if="filtered.length === 0" class="empty">
          <div class="empty__icon"><AppIcon name="search" :size="22" /></div>
          <div class="empty__text">조건에 맞는 소가 없습니다</div>
          <BsButton variant="secondary" size="sm" @click="resetFilters">필터 초기화</BsButton>
        </div>

        <div class="dt__foot">
          <span class="dt__foot-count">{{ formatNumber(filtered.length) }}두 중 1–{{ filtered.length }} 표시</span>
          <BsPagination v-model="page" :total="6" />
        </div>
      </div>
    </BsCard>
  </div>
</template>
