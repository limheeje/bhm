# BHM 딜러 포털 — 2차 스펙 (고도화 로드맵)

> 1차(딜러 API 연동 학습, 2026-07-06~08)가 끝난 뒤 시작하는 다음 단계.
> `role.md`의 롤 분담(백엔드+기획=Claude, 프론트=사용자)은 그대로 유지.
> 진행 순서는 **아래 순번대로 하나씩** — 완료되면 체크하고 다음으로.

## 진행 순서

- [x] 1. 소 상세 페이지 (`pages/auctions/[receiptNo]/index.vue`) — 2026-07-09 완료
- [x] 2. 경락내역(낙찰 결과) 전용 페이지 (`pages/bids/index.vue`) — 2026-07-10 완료 (날짜/유찰유무 필터는 "조회" 버튼 클릭 시에만 반영, 페이지네이션은 즉시 반영)
- [ ] 3. 실시간 경매 현황 (WebSocket)
- [ ] 4. 설정 페이지 실제 API 연동

---

## 1. 소 상세 페이지

**왜 필요한가**: `GET /api/dealer/auctions/listings/cattle/{receiptNo}` 백엔드는 이미 완성돼 있는데, 이걸 부르는 프론트 페이지가 없음. 소 목록/부위 목록에서 항목을 클릭해도 아무 반응이 없는 상태 — 이미 만든 API를 놀리고 있는 셈.

**백엔드**: 이미 완성. 추가 작업 없음.

- `GET /api/dealer/auctions/listings/cattle/{receiptNo}` → `SingleResponse<CattleDetail>`
- 응답 `data` 구조:
  ```ts
  {
    receiptNo: string
    breedCd: string
    genderCd: string
    gradeCd: string
    marblingGrade: string
    monthAge: number
    carcassWt: number
    companyNo: string
    companyNm: string
    favorite: boolean
    interestSeq: number | null
    parts: {
      listingNo: string
      partCd: string
      partNm: string
      weight: number
      minPrice: number
      listedYn: 'Y' | 'N'
      favorite?: boolean
      interestSeq?: number | null
    }[]
  }
  ```
- 없는 `receiptNo`로 조회하면 404 + `{success:false, message:'해당 경매 정보를 찾을 수 없습니다.'}`

**프론트 (사용자 작업)**:
1. `composables/useAuctionsApi.ts`에 `getCattleDetail(receiptNo)` 함수 + `CattleDetailResponse` 타입 추가
2. `pages/auctions/[receiptNo]/index.vue` 동적 라우트 신규 생성
   - 소 기본 정보 + 부위 리스트(부위별 즐겨찾기 토글 포함) 표시
   - 소 자체 즐겨찾기 토글도 필요 (상세에서도 즐겨찾기 가능하게)
3. 진입 지점 2곳 연결
   - `pages/auctions/index.vue` 목록 row 클릭 → `/auctions/{receiptNo}`
   - `pages/auctions/parts/index.vue` 목록 row 클릭 → 그 부위가 속한 소의 `/auctions/{receiptNo}` (부위 객체의 `receiptNo` 필드 사용)

**주의할 것**: 소 상세 API와 부위 목록 API는 **같은 부위 객체 참조**를 공유하도록 만들어져 있음 (mock 설계상 의도된 것). 즉 상세 페이지에서 부위를 즐겨찾기하면 `/auctions/parts` 목록에도 바로 반영돼야 정상 — 이 부분은 새로고침 후 재조회니까 자동으로 맞음.

---

## 2. 경락내역(낙찰 결과) 전용 페이지

**왜 필요한가**: `dealer/auctions/bids`, `bids/summary` API는 이미 있지만 대시보드에서 요약 카드로만 소비 중. 중도매인이 "내가 언제 얼마에 낙찰받았는지"를 기간별로 조회/감사하는 화면이 따로 없음 — 정산 확인, 장부 대조 시 실제로 자주 찾는 화면.

**백엔드**: 완료 (2026-07-09).

- `GET /api/dealer/auctions/bids` — 기존 목록 API에 쿼리 파라미터 3개 추가
  | 파라미터 | 타입 | 설명 |
  |----------|------|------|
  | startDate | string | 'YYYY-MM-DD', 시작일 (미입력 시 전체) |
  | endDate | string | 'YYYY-MM-DD', 종료일 (미입력 시 전체) |
  | hideUnsold | 'true' \| 미입력 | 'true'면 유찰 건 제외 |
  | page / size | number | 기존과 동일 (0-based) |
- 응답 `data` 배열의 각 항목에 필드 2개 추가: `bidDt`(string, 'YYYY-MM-DD HH:mm' 낙찰일시), `unsoldYn`('Y' \| 'N', 유찰 여부)
- `unsoldYn: 'Y'`인 건은 `bidPrice`가 `0`으로 옴 (유찰이라 낙찰가 자체가 없음 — 화면에서 `-`로 표시 권장)

**프론트 (사용자 작업)**: 지금은 `pages/bids/index.vue`에 **더미 데이터로 그린 정적 UI만** 있는 상태예요 (날짜 필터/유찰 숨기기 스위치도 시각적으로만 존재, 아직 아무 동작 안 함). 다음 순서로 연동하면 돼요.

1. `composables/useAuctionsApi.ts`(또는 별도 `useBidsApi.ts`)에 `getBids(params)` 함수 + 타입 추가
2. 더미 `rows` 배열 → `useAsyncData`로 교체 (지금까지 만든 목록 페이지와 같은 패턴)
3. 날짜 `BsInput`, `BsSwitch`에 `v-model` 연결하고 `useAsyncData`의 `watch` 옵션에 추가
4. 페이지네이션 `BsPagination`도 실제 `currentPage`/`totalPages`로 교체

---

## 3. 실시간 경매 현황 (WebSocket)

**왜 필요한가**: 지금까지 만든 화면은 전부 "이미 끝난 결과 조회"뿐. 실제 경매가 진행되는 동안 입찰 상황을 실시간으로 보는 건 이 서비스 본연의 기능에 가장 가까움. `API_SPEC.md` 5-2, 9장 기준.

**범위 축소 (2026-07-10 확정)**: 관리자 포털이 없는 프로젝트라 회차 시작/종료/마감 관리 기능은 생략. "항상 하나의 회차가 진행 중"이라고 가정하고, 딜러가 실시간 입찰 현황을 보고 입찰을 제출하는 부분만 구현.

**백엔드**: 완료 + 실기동 테스트 완료 (2026-07-10). 연결/INIT 스냅샷/입찰 제출/`BID_UPDATE` 브로드캐스트/낮은 금액 `BID_REJECTED`/자동 시뮬레이션(`BID_UPDATE`가 다른 항목에서도 옴)까지 전부 실제 WebSocket 클라이언트로 확인함.

- `nuxt.config.ts`에 `nitro.experimental.websocket: true` 추가
- `server/utils/liveAuctionState.ts` — 진행 중인 경매 항목(`LiveLot[]`) 상태 관리, 접속자(peer) 관리, 입찰 처리, 4초마다 "다른 중도매인"이 입찰하는 것처럼 자동 시뮬레이션
- `server/api/dealer/auctions/live.ts` — WebSocket 핸들러

**연결 주소**: `ws://<host>/api/dealer/auctions/live` (REST와 동일하게 `/api` 프리픽스 붙음 — `apiBaseURL` 설정과 일치시킴)

**메시지 프로토콜**

서버 → 클라이언트:
```ts
// 접속 직후 1회 — 현재 진행 중인 항목 전체 스냅샷
{type: 'INIT', payload: {lots: LiveLot[]}}

// 입찰(본인 or 다른 중도매인) 발생 시마다
{type: 'BID_UPDATE', payload: LiveLot}

// 항목 마감 시
{type: 'LOT_CLOSED', payload: LiveLot}

// 본인이 보낸 입찰이 거부됐을 때 (예: 현재가보다 낮은 금액)
{type: 'BID_REJECTED', payload: {message: string}}
```

```ts
interface LiveLot {
  lotId: string
  receiptNo: string
  partNm: string
  gradeCd: string
  companyNm: string
  startPrice: number
  currentPrice: number
  bidCount: number
  status: 'ACTIVE' | 'END'
  highestBidderLabel: string | null
}
```

클라이언트 → 서버 (입찰 제출):
```ts
{type: 'BID', payload: {lotId: string, price: number}}
```

**프론트 (사용자 작업)**: `WebSocket` 객체로 위 주소에 연결 → `onmessage`에서 `type`별로 분기해서 로컬 상태 갱신 → 입찰 버튼 클릭 시 `ws.send(JSON.stringify({type: 'BID', payload: {...}}))`. 페이지 벗어날 때 `ws.close()` 꼭 호출(연결 안 끊으면 계속 붙어있음).

**진행 상황 (2026-07-10)**: `pages/auctions/live/index.vue`, GNB "경매 > 실시간현황" 메뉴 — 더미 데이터로 그린 정적 UI만 완료. WebSocket 연결/메시지 처리/입찰 전송은 아직 미연동.

---

## 4. 설정 페이지 실제 연동

**왜 필요한가**: `pages/settings/index.vue`가 지금은 이름/이메일/알림 토글이 전부 하드코딩된 정적 UI. 실제 저장이 안 됨.

**백엔드**: `API_SPEC.md`에 프로필 수정 관련 API가 명시돼 있지 않음 — 착수 시점에 필요한 API 범위(프로필 수정만? 알림 설정도?) 먼저 정하고 없는 부분은 새로 설계.

**난이도**: 낮음. 다만 서비스 임팩트는 상대적으로 작아서 순서상 뒤로 뺌.
