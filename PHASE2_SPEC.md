# BHM 딜러 포털 — 2차 스펙 (고도화 로드맵)

> 1차(딜러 API 연동 학습, 2026-07-06~08)가 끝난 뒤 시작하는 다음 단계.
> `role.md`의 롤 분담(백엔드+기획=Claude, 프론트=사용자)은 그대로 유지.
> 진행 순서는 **아래 순번대로 하나씩** — 완료되면 체크하고 다음으로.

## 진행 순서

- [x] 1. 소 상세 페이지 (`pages/auctions/[receiptNo]/index.vue`) — 2026-07-09 완료
- [ ] 2. 경락내역(낙찰 결과) 전용 페이지 (`pages/bids/index.vue`)
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

**백엔드**: 대부분 이미 있음. `API_SPEC.md` 5-3 기준 `startDate`/`endDate`/`hideUnsold` 쿼리 파라미터 필터링이 `bids.get.ts`에 아직 없으면 추가 필요 — 착수 시점에 실제 구현 확인 후 보완.

**프론트 (사용자 작업)**: 날짜 범위 필터 + 페이지네이션 목록. 지금까지 만든 목록 페이지(소 목록, 부위 목록)와 같은 패턴 재사용.

---

## 3. 실시간 경매 현황 (WebSocket)

**왜 필요한가**: 지금까지 만든 화면은 전부 "이미 끝난 결과 조회"뿐. 실제 경매가 진행되는 동안 입찰 상황을 실시간으로 보는 건 이 서비스 본연의 기능에 가장 가까움. `API_SPEC.md` 5-2, 9장 기준.

**난이도**: 지금까지 중 가장 높음 — 경매 상태 흐름(`DRAFT→APPROVED→ACTIVE→CLOSING→END`) 설계와 WebSocket 연결 관리가 필요. 착수 전 별도로 설계 논의 필요.

---

## 4. 설정 페이지 실제 연동

**왜 필요한가**: `pages/settings/index.vue`가 지금은 이름/이메일/알림 토글이 전부 하드코딩된 정적 UI. 실제 저장이 안 됨.

**백엔드**: `API_SPEC.md`에 프로필 수정 관련 API가 명시돼 있지 않음 — 착수 시점에 필요한 API 범위(프로필 수정만? 알림 설정도?) 먼저 정하고 없는 부분은 새로 설계.

**난이도**: 낮음. 다만 서비스 임팩트는 상대적으로 작아서 순서상 뒤로 뺌.
