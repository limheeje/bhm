# Lumo 한우 경매 — page templates (Nuxt 3)

딜러용 한우 경매(경락) 백오피스 화면. 모두 **`Bs*` 컴포넌트로 조립**했고, 폴더형 + 스타일 분리 규칙을 그대로 따릅니다 (`index.vue` 에는 `<style>` 없음 → `index.style.scss` 로 분리, 토큰만 사용). **반응형** (데스크톱 ↔ 모바일).

## 구성

```
layouts/
  default.vue            ← 앱 셸: AppSidebar + AppTopbar + <slot/>, BsToastProvider 로 감쌈
  default.style.scss
app/
  AppIcon/               ← 이름 기반 인라인 SVG 아이콘 (1.8px stroke, Lucide 계열)
  AppSidebar/            ← 로고 + 경매 네비(NuxtLink 활성) + 딜러 정보. ≤900px 아이콘레일 축소
  AppTopbar/             ← 페이지 타이틀, 검색, 다크모드 토글, 로그아웃. ≤720px 검색 숨김
  data.ts                ← 목 데이터 · 타입 · 코드 라벨(GENDER/BREED/등급 톤) · 포맷 헬퍼
  shared.scss            ← 공유 패턴: .pg(헤더) · .kpi · .dt(데이터테이블, 가로스크롤) · .empty
pages/
  login/index.vue        → /login     (layout: false)
  dashboard/index.vue    → /dashboard  경락 내역 (KPI + 경락 테이블 + 자산/공지 요약)
  auctions/index.vue     → /auctions   소 목록 (등급·업체 필터 + 검색 + 테이블 + 즐겨찾기 + 페이지네이션)
  favorites/index.vue    → /favorites  즐겨찾기 (소 / 부위 탭)
  notices/index.vue      → /notices    공지사항 (목록 + 상세 모달, ?no=1 로 딥링크)
  balance/index.vue      → /balance    자산 (잔고 hero + 입출금 + 거래 내역)
```

## 라우팅

Nuxt 파일 기반 라우팅이 `pages/<name>/index.vue` → `/<name>` 으로 매핑합니다.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/lumo/styles.css'],
  routeRules: { '/': { redirect: '/dashboard' } },
})
```

```vue
<!-- app.vue -->
<template><NuxtLayout><NuxtPage /></NuxtLayout></template>
```

`login` 은 `definePageMeta({ layout: false })` 로 셸 없이 렌더, 나머지는 `default` 레이아웃 사용.

## 코드값 한글 표기 (data.ts)

- `genderCd`: STEER=거세 · COW=암소 · BULL=수소
- `breedCd`: HANWOO=한우
- `gradeCd`: 1+/1/2/3 (등급 → 배지 톤은 `gradeTone()` 으로 매핑)
- `marblingGrade`: BMS9 등 모노폰트로 표기
- 거래 `typeCd`/금액 부호: 입금(+, success) · 출금(−)

## 의존성

- 토큰: `styles.css` 1회 등록 (`vue/README.md` 참고)
- `sass` (scss 컴파일)
- 아이콘 패키지 불필요 — `AppIcon` 이 세트를 내장. 원하면 `lucide-vue-next` 로 교체 가능.

## 컴포넌트 조립 방식

- **경락 내역** — `BsCard`(KPI·패널), `BsBadge`, `BsButton`, `AppIcon` + 자산/공지 요약 카드
- **소 목록** — `BsSelect`(필터), `BsInput`(검색), `BsBadge`(등급), `BsPagination`, 즐겨찾기 토글 + `useToast`
- **즐겨찾기** — `BsTabs`(소/부위), `BsBadge`, 제거 액션 + `useToast`
- **공지사항** — 목록 + `BsModal`(상세), `BsBadge`(고정/유형)
- **자산** — 브랜드 hero 카드 + `BsCard`(거래 내역) + `useToast`

테이블/피드/그리드 같은 페이지 고유 레이아웃은 각 페이지 `index.style.scss` + 공유 `app/shared.scss` 에서 토큰으로 처리 — 컴포넌트는 범용 유지, 페이지가 조립을 소유합니다.

## 디자인 미리보기

`ui_kits/auction/index.html` — 이 5개 화면을 정적으로 렌더한 **시각 확인용** 프리뷰 (React). `.vue` 빌드 없이 디자인·반응형·다크모드를 바로 눈으로 확인할 수 있습니다. (실제 배포 소스는 `vue/` 의 `.vue`/`.ts`/`.scss`)
