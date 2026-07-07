# TransactionList

거래 내역 목록 — `BsCard`로 감싼 행 리스트 + 페이지네이션. `pending`이면 실제 행과 동일한 레이아웃의 스켈레톤(`TransactionListSkeleton.vue`)을 보여줍니다.

```vue
<TransactionList
  :items="transactionsData?.data ?? []"
  :pending="transactionsPending"
  v-model:page="currentPage"
  :total-pages="transactionsData?.pageInfo.totalPages"
/>
```

## Props

| Prop           | Type            | Default | 설명                                 |
| -------------- | --------------- | ------- | ------------------------------------ |
| `items`        | `Transaction[]` | —       | `GET /api/dealer/asset/transactions`의 `data` |
| `pending`      | `boolean`       | `false` | `true`면 스켈레톤 표시                |
| `page`         | `number`        | —       | 1-based, `v-model:page`로 바인딩      |
| `totalPages`   | `number`        | `1`     | `res.pageInfo.totalPages`             |
| `skeletonRows` | `number`        | `5`     | 로딩 중 보여줄 자리표시 행 개수       |

## Events

- `update:page` — 페이지네이션 버튼 클릭 시 발생 (`v-model:page`)

`page`는 1-based인데 API의 `page` 쿼리 파라미터는 0-based이니, 호출부에서 `page: currentPage - 1`로 변환해서 보내야 합니다.
