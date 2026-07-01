# BHM 프로젝트 — Claude 컨텍스트

## 개발자 정보

- **역할**: 퍼블리셔에서 프론트엔드로 영역을 확장 중인 초보 개발자
- **설명 방식**: 항상 쉽게, "왜 이렇게 해야 하는가" 이유 중심으로 설명할 것
- 어려운 용어는 비유와 함께 풀어서 설명

## 기술 스택

| 항목          | 내용                                |
| ------------- | ----------------------------------- |
| 프레임워크    | Nuxt 3                              |
| UI 라이브러리 | Vue 3 Composition API               |
| 상태관리      | Pinia + pinia-plugin-persistedstate |
| 언어          | TypeScript                          |
| 컴포넌트      | @nuxt/ui                            |

## 참조 문서 (프로젝트 루트)

- `API_SPEC.md` — 백엔드 API 정의서 (v2.1, 2026-06-18 최종 수정)
- `API_INTEGRATION_GUIDE.md` — 구현 순서 및 상세 코드 가이드
- `LOGIN_TASK_GUIDE.md` — 로그인 처리 관련 남은 작업 체크리스트 및 가이드

## 포털 구조

| 포털     | userType 값 | 로그인 경로      | 로그인 후 이동       |
| -------- | ----------- | ---------------- | -------------------- |
| 관리자   | `ADMIN`     | `/login`         | `/admin/dashboard`   |
| 상장업체 | `COMPANY`   | `/company/login` | `/company/dashboard` |
| 중도매인 | `DEALER`    | `/dealer/login`  | `/dealer/dashboard`  |
| 모바일   | `DEALER`    | `/mobile/login`  | `/mobile/dashboard`  |

## 현재 구현 상태 (2026-06-22 기준)

### 완료된 파일

- [x] `nuxt.config.ts` — 프록시 + pinia 모듈 설정 완료
- [x] `types/commonResponse.ts` — API 공통 응답 타입 (SingleResponse, ListResponse, PaginationResponse)
- [x] `types/auth.ts` — 로그인 요청/응답 타입 (LoginRequest, LoginResponse)
- [x] `utils/cookie.ts` — setCookie / getCookie / removeCookie
- [x] `composables/useClientFetch.ts` — fetch 래퍼 기본 버전 (GET, POST만 구현, refresh 미적용)
- [x] `composables/useLoginApi.ts` — 로그인 / 로그아웃 API
- [x] `stores/authStore.ts` — 전역 로그인 상태 (persist: true 포함)
- [x] `pages/login.vue` — 로그인 폼 기본 동작 (로그인 후 리다이렉트 없음)

### 미완성 항목 (LOGIN_TASK_GUIDE.md에 상세 설명)

- [ ] `.env` — 환경변수 파일
- [ ] `pages/login.vue` — 로그인 성공 후 userType별 페이지 이동 추가
- [ ] `pages/login.vue` — 이미 로그인된 상태면 대시보드로 자동 이동
- [ ] `composables/useClientFetch.ts` — 401/403 자동 refresh 처리 (전체 교체)
- [ ] `middleware/auth.ts` — 로그인 안 된 사용자의 접근 차단
- [ ] `pages/admin/dashboard/index.vue` 등 — 각 포털 대시보드 페이지

## 코드 컨벤션

- API 관련 타입: `types/` 폴더
- API 호출 함수: `composables/use*Api.ts` 패턴으로 기능별 파일 분리
- 쿠키 보관:
  - `accessToken` → 일반 쿠키 (JS에서 읽기 가능, setCookie로 저장)
  - `refreshToken` → httpOnly 쿠키 (JS 접근 불가, 백엔드가 자동 세팅)
- **authStore 로그아웃 액션명은 `setLogout()`** — `logout()`이 아님 (혼동 주의)
- 로그인 API의 401: 리다이렉트 없이 에러 메시지만 표시
- 그 외 모든 API의 401/403: refresh 시도 → 실패 시 로그아웃 + 로그인 페이지 이동
