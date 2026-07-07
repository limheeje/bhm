# 업무 롤 정의 (Claude ↔ 사용자)

이 프로젝트에서 Claude와 사용자가 어떤 역할을 맡는지 정의한 문서. 앞으로 계속 참조.

## 역할 분담

| 영역                                                     | 담당   | 작업 방식                                 |
| ---------------------------------------------------------- | ------ | ------------------------------------------ |
| `server/api/*.ts` (Nitro 백엔드 라우트)                   | Claude | 직접 코드 작성/수정                       |
| 프로젝트 기획 (기능 흐름, UX, 소비자 편의성)              | Claude | 제안 + 근거 설명                          |
| `pages/`, `components/`, `composables/`, `stores/`        | 사용자 | Claude는 설명 + 코드블록만 제공, 직접 타이핑하며 학습 |
| `mocks/handlers/*.ts`                                     | 사용자 | 위와 동일                                 |

## Claude 담당 — 백엔드 (`server/api`)

- 요청받은 API를 Nitro 라우트로 직접 구현 (`server/api/**/*.ts`)
- `API_SPEC.md` 기준을 따르되, 스펙이 애매하거나 비어있으면 **소비자(최종 사용자) 입장에서 더 편한 방향**으로 판단해 기획까지 보완
  - 예: 에러 메시지를 사용자가 이해하기 쉽게 다듬기, 불필요한 재로그인 방지, 응답 구조를 프론트에서 다루기 쉽게 정리 등
- 백엔드 구현이 프론트 사용성에 영향을 주는 부분(에러 케이스, 응답 형태, 상태 코드)은 이유와 함께 사용자에게 설명

## Claude 담당 — 기획 보조

- 이 프로젝트(BHM 도매시장 관리 시스템)의 실제 사용자가 겪을 불편함을 먼저 고려해서 기능/흐름을 제안
- 단순히 "동작하는 코드"가 아니라 "왜 이 흐름이 소비자에게 편한지"까지 설명
- 기획 관련 제안은 강요하지 않고, 근거를 제시한 뒤 사용자 판단에 맡김

## 사용자 담당 — 프론트엔드

- `pages/`, `components/`, `composables/`, `stores/`, `mocks/handlers/*` 는 사용자가 직접 타이핑하며 작성
- Claude는 이 영역에서 **파일을 직접 만들거나 수정하지 않음** — 설명 + 코드블록만 제공
- 예외: 사용자가 "만들어줘", "작성해줘"라고 명시적으로 요청한 경우에만 Claude가 직접 작성

## 참고

- 초보 프론트엔드 개발자(퍼블리셔 출신)이므로 설명은 항상 쉽고 "왜"가 중심
- 전체 프로젝트 컨텍스트는 `CLAUDE.md` 참조

## dealer API 연동 학습 순서 (2026-07-06 확정, 07-06 파일 경로 정정)

`pages/dealer/**`는 과거 흔적(사용 안 함). 실제 작업 대상은 `pages/balance`, `pages/notices`, `pages/dashboard`, `pages/auctions`, `pages/favorites` — UI는 완성되어 있고 `app/data`의 정적 mock(`BALANCE`, `TRANSACTIONS`, `NOTICES`, `BIDS`, `CATTLE_LIST` 등)을 실제 API 호출로 교체하는 게 목표.

- [x] 1. 잔고 (`pages/balance/index.vue`) — `asset/balance`, `asset/transactions` — 2026-07-06 완료 (아래 "주의사항" 참고)
- [x] 2. 공지사항 목록/상세 (`pages/notices/index.vue`) — `dealer/notices`, `dealer/notices/{ntceNo}` — 2026-07-07 완료
- [ ] 3. 대시보드 (`pages/dashboard/index.vue`) — `dealer/auctions/bids` 등 — 여러 API를 한 화면에 조합
- [ ] 4. 소 목록 (`pages/auctions/index.vue`) — `auctions/listings/cattle` + `auctions/filter-options` — API 2개 조합
- [ ] 5. 소 상세 — `auctions/listings/cattle/{receiptNo}` — path param + 상세 화면 (해당 페이지 없으면 추후 생성)
- [ ] 6. 즐겨찾기 (`pages/favorites/index.vue`) — `favorites` GET/POST/DELETE — 조회+등록+삭제 한 화면에서 처리, 제일 복잡

## 2026-07-06 작업 요약

- 백엔드/기획/프론트 롤 분담 확정 (이 문서 최초 작성)
- `mocks/`(MSW), `plugins/msw.client.ts` 삭제 → `server/api`로 백엔드 통일
- `nuxt.config.ts`의 `routeRules` proxy(`/api/**` → `192.168.0.99`) 삭제 — 로컬 `server/api` 라우트를 가로막고 있던 원인이라 제거. **진짜 백엔드 연결 시 다시 검토 필요** (전체 프록시 대신 미구현 경로만 프록시하는 방식 고려)
- `server/api/dealer/**` 8개 라우트 신규 구현 (경락내역, 필터옵션, 소목록/상세, 즐겨찾기 CRUD, 공지사항 목록/상세, 잔고, 거래내역) — `API_SPEC.md`의 `PaginationResponse` 규격에 맞춰 응답 구조 정리
- `nuxt.config.ts`에서 `@nuxt/ui` 모듈 제거 — 커스텀 `useToast`/`useModal`이 `@nuxt/ui`의 동명 컴포저블에 자동 import가 가려지던 버그 해결
- `useToast`를 `useModal`과 동일한 컨트롤러 패턴(`toast.open()`, `toast.dismiss()`)으로 리팩터링
- `useClientFetch.ts`의 치명적 버그 수정 — 성공 시 `await _$fetch()` 결과를 버리고 `return new Promise(() => {})`로 영원히 안 끝나는 Promise를 반환하던 문제 → `return (await _$fetch()) as T`로 수정
- 거래내역 mock 데이터를 240건으로 확장 (`size:20` 기준 12페이지) — 페이지네이션 테스트용
- `pages/balance/index.vue` 완성: 단건 응답(`asset/balance`) → 페이지네이션 목록(`asset/transactions`) → 페이지 변경 시 갱신 → 1-based/0-based 인덱스 정리까지 순서대로 진행하며 실제 버그를 하나씩 발견/수정

## 주의사항 (다음 페이지 작업 시 계속 부딪힐 수 있는 것들)

- **페이지네이션 인덱스**: `BsPagination`의 `modelValue`는 **1부터 시작**, `server/api`의 `page` 파라미터는 **0부터 시작**. API 호출 직전에 항상 `page: currentPage.value - 1`로 변환할 것.
- **`useAsyncData`로 목록을 다시 불러올 때**: `watch(() => x.value, () => fetchFn())`처럼 수동으로 다시 불러오면 결과가 버려짐. `useAsyncData(key, fetcher, {watch: [의존값]})` 옵션을 써야 자동으로 `data`에 반영됨.
- **응답 구조 한 단계 주의**: `SingleResponse<T>`는 실제 값이 `res.data`에 한 번 더 감싸져 있음 (`res.data.balance`처럼). `PaginationResponse<T>`는 `res.data`가 바로 배열.
- **`BASE_URL` export 중복 미해결**: `useLoginApi.ts`(`/auth`)와 `useAssetApi.ts`(`/dealer`)가 둘 다 최상위 `export const BASE_URL`을 갖고 있어 Nuxt 자동 import가 충돌함(하나만 조용히 무시됨). 아직 안 고침 — 새 `use*Api.ts` composable 만들 때 `BASE_URL`을 export하지 말거나 파일별로 다른 이름 사용할 것.
- **API 실패 처리 없음**: 지금까지 만든 페이지들은 `pending`만 보고 `error`는 안 보고 있음. 다음 페이지부터는 `useAsyncData`의 `error`도 받아서 실패 시 안내를 보여주는 습관 들이기.
- **`@nuxt/ui`는 여전히 `node_modules`/`package-lock.json`에 남아있음**: `package.json` 의존성에서만 빠진 상태라, 언젠가 `npm install`을 다시 돌리면 사라짐. 지금 당장 문제는 없음.

## 2026-07-07 작업 요약 (공지사항)

- `useNoticeApi.ts` 신규 작성 (`getNotices`, `getNoticesDetail`) — try/catch 포함, JSDoc `@response` 타입도 실제 타입 기준으로 정확히 맞춤
- `pages/notices/index.vue`: 목록 페이지네이션(50건 mock) + 상세 모달 연동 완료
- mock 데이터 확장: 공지사항 목록 50건, 상세 데이터도 1~50번 전부 채움 (`server/utils/dealerMockData.ts`)
- 발견/수정한 버그:
  - `resNotices.value?.data`에서 `.value` 빠뜨림 (템플릿은 자동 언랩, `<script>`는 수동으로 `.value` 필요)
  - 페이지 인덱스 `-1` 변환 누락 → 마지막 페이지 clamp 때문에 9번/10번 페이지가 동일하게 보이던 버그
  - `BsModal`/`BsButton` import 누락 → 모달이 아예 안 뜨던 버그. **`components/common/*` 하위 컴포넌트는 자동 import가 안 됨 — 폴더명이 붙은 `CommonBsModal` 같은 이름으로만 자동 등록되고, plain 이름(`BsModal`)은 `~/components/common`에서 매번 명시적으로 import해야 함**
  - `useAsyncData`의 `error`를 안 받아서 실패 시 크래시/무반응이던 것 → `error` 상태 추가, 실패 토스트 추가
- `useToast`의 `ToastOptions`/`ToastController`에 JSDoc 정리 — 호출부(`toast.open(...)`)에서 툴팁이 뜨려면 **구현부가 아니라 인터페이스 선언에 JSDoc을 달아야 함**(타입 기반으로 hover 정보가 뜨기 때문)

## 보류된 기능

- **대시보드 "전회차 대비 +12.4%"** — 원래 정적 UI에서도 하드코딩된 가짜 숫자였음. 진짜로 구현하려면 `MOCK_BIDS`에 `auctionSeq`(회차) 개념을 새로 추가하고 회차별 그룹핑/증감률 계산이 필요함 (`API_SPEC.md` 5-2 참고). 2026-07-07 기준 보류 — 필요해지면 그때 설계.

## 정리 대상 (남은 tech debt)

- **`pages/dealer/**` 폴더 삭제 권장** — 과거 흔적이라 안 쓰는데, `useNoticeApi.ts` 함수명이 바뀌면서 이 폴더 안에서 타입 에러 3개가 남. 실제 라우팅엔 영향 없지만 `npx vue-tsc` 돌릴 때마다 노이즈가 낌.
- `pages/notices/index.vue`의 `console.log('getNoticesDetail---', res)` 디버그 로그 정리
- "목로불러오기 실패" 오타 → "목록 불러오기 실패"
- 목록 0건일 때 빈 상태 메시지 없음 (지금은 mock이 항상 50건이라 안 드러남)
