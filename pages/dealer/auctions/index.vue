<script setup lang="ts">
import StringUtil from '~/utils/StringUtil'
import {USER_FAVORITE_TYPE} from '~/constants/userFavoriteType'
import type {CattleListItem} from '~/composables/useAuctionsApi'
const api = useAuctionsApi()

// onMounted(async () => {
//   try {
//     const res = await api.getFilterOptions({
//       auctionDate: StringUtil.formatDate(new Date())
//     })
//     if (res?.success && res?.data) console.log(res.data)
//   } catch (err) {
//     console.log(err)
//   }
// })

const {data: localLoadItems, pending} = await useAsyncData('page-load-items', async () => {
  const [filterItems, cattleItems] = await Promise.all([
    api.getFilterOptions({
      auctionDate: StringUtil.formatDate(new Date())
    }),
    api.getListingsCattle({
      auctionDate: StringUtil.formatDate(new Date())
    })
  ])
  return {
    localFilterOptionsItems: filterItems?.success && filterItems?.data ? filterItems.data : null,
    localListingsCattleItems: cattleItems?.success && cattleItems?.data ? cattleItems.data : null
  }
})

async function onClickFavorite(item: CattleListItem) {
  console.log('item----', item)
  const {receiptNo} = item
  if (!item.favorite) {
    //즐겨찾기 등록
    const res = await api.postFavorites({
      receiptNo,
      type: USER_FAVORITE_TYPE.CATTLE
    })
    console.log('res-----', res)
  }
}
</script>

<template>
  <div>
    경매장 하이~
    {{ localLoadItems?.localFilterOptionsItems?.grades }}<br />
    {{ localLoadItems?.localListingsCattleItems?.list }}<br />
    <template v-if="pending">
      <div style="display: flex; background-color: red; width: 100%; height: 500px">라라라라</div></template
    >
    <template v-for="(item, index) in localLoadItems?.localListingsCattleItems?.list" :key="index">
      <div
        style="
          background: blue;
          margin-bottom: 10px;
          position: relative;
          height: 50px;
          display: flex;
          align-items: center;
        "
      >
        <nuxt-link :to="{path: `/dealer/auctions/${item.receiptNo}`}"> {{ item.receiptNo }} </nuxt-link>
        <button class="favority" :class="item.favorite ? 'is-active' : ''" @click="onClickFavorite(item)" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.favority {
  width: 30px;
  height: 30px;
  background: white;
  position: absolute;
  right: 10px;
  top: 10px;
  &.is-active {
    background: red;
  }
}
</style>
