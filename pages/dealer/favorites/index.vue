<script setup lang="ts">
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'
const api = useFavoritesApi()
const localParams = reactive({
  type: USER_FAVORITE_TYPE.CATTLE
})

const {data: localFavoriteItems, pending} = await useAsyncData('favorite-list', loadApi, {
  watch: [() => localParams.type]
})

async function loadApi() {
  const res = await api.getFavorites(localParams)
  console.log('res---------', res)

  if (res?.success && res?.data) return res.data
  return null
}
</script>

<template>
  <div>
    <template v-if="pending">
      <div style="display: flex; background-color: red; width: 100%; height: 500px">라라라라</div></template
    >
    즐겨찾기{{ localFavoriteItems }}
    <input id="rdo1" v-model="localParams.type" type="radio" :value="USER_FAVORITE_TYPE.CATTLE" />
    <label for="rdo1">{{ USER_FAVORITE_TYPE.CATTLE }}</label>
    <input id="rdo2" v-model="localParams.type" type="radio" :value="USER_FAVORITE_TYPE.PART" />
    <label for="rdo2">{{ USER_FAVORITE_TYPE.PART }}</label>
    {{ localParams }}

    <template v-if="!localFavoriteItems?.length">
      <div style="margin: 50px 0">{{ localParams.type }}데이터없음</div>
    </template>
    <template v-else>
      <div v-for="(item, index) in localFavoriteItems" :key="index">
        {{ item.companyNm }}<br />
        {{ item.gradeCd }}<br />
        {{ item.interestSeq }}<br />
      </div>
      >
    </template>
  </div>
</template>

<style scoped>
.is-active {
  background: red;
}
</style>
