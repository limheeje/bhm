# 로그인 처리 — 최종 완료 가이드

> 작성일: 2026-06-22 (최종 업데이트)
> 참조: `API_SPEC.md`, `API_INTEGRATION_GUIDE.md`

---

## 최종 완료 현황

```
✅ nuxt.config.ts                프록시 설정
✅ .env                          환경변수 (프로젝트 루트)
✅ types/commonResponse.ts       API 응답 공통 타입
✅ types/auth.ts                 로그인 타입 + UserType 적용
✅ constants/userType.ts         유저타입 상수 (신규)
✅ utils/cookie.ts               쿠키 유틸
✅ composables/useClientFetch.ts fetch 래퍼 (401/403 refresh 포함)
✅ composables/useLoginApi.ts    로그인/로그아웃 API
✅ stores/authStore.ts           전역 로그인 상태
✅ pages/login.vue               로그인 폼 + 성공 후 리다이렉트
✅ middleware/auth.global.ts     전역 페이지 보호 (신규)
✅ pages/dealer/dashboard.vue    대시보드 + 로그아웃
```

---

## 오늘 새로 만든 파일들

### 1. `.env` (프로젝트 루트)

```bash
API_BASE_URL_CLIENT=/api
API_PROXY_TARGET=http://192.168.0.99
```

> **주의**: `config/` 폴더가 아닌 **프로젝트 루트**에 있어야 Nuxt가 읽음

---

### 2. `constants/userType.ts` (신규)

```ts
export const USER_TYPE = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
  DEALER: 'DEALER'
} as const

export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE]
```

**왜 만들었나:**
`'ADMIN'` 같은 문자열을 코드 여기저기 하드코딩하면, 나중에 값이 바뀔 때 전부 찾아서 바꿔야 함.
상수로 중앙 관리하면 `USER_TYPE.DEALER` 처럼 쓰고, 바꿀 때 이 파일 하나만 수정하면 됨.

---

### 3. `middleware/auth.global.ts` (신규)

```ts
import {USER_TYPE} from '~/constants/userType'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const loginPages = ['/login', '/dealer/login']
  const isLoginPage = loginPages.includes(to.path)

  // 로그인 페이지인데 이미 로그인 상태 → 대시보드로
  if (isLoginPage && authStore.isLoggedIn) {
    return navigateTo('/dealer/dashboard')
  }

  // 보호된 페이지인데 로그인 안 됨 → 로그인 페이지로
  if (!isLoginPage && !authStore.isLoggedIn) {
    return navigateTo('/dealer/login')
  }
})
```

**왜 `.global.ts` 인가:**
파일명에 `.global`을 붙이면 모든 페이지에 자동 적용됨.
`definePageMeta({ middleware: 'auth' })` 를 각 페이지마다 쓸 필요 없음.

---

## 오늘 개선된 파일들

### 4. `types/auth.ts` — UserType 적용

```ts
import type {UserType} from '~/constants/userType'

export interface LoginRequest {
  contactNo: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  managerId: string
  managerName: string
  userType: UserType // string → UserType으로 교체
  orgNm: string
  orgNo: string
  roleCd: string
  expiresIn: number
}

export interface LoginMeResponse {
  staffContactNo: string
  staffNm: string
  userType: UserType
  orgNm: string
  orgNo: string
  roleCd: string
  lastLoginDt: string
  lastLoginIp: string
}
```

---

### 5. `composables/useClientFetch.ts` — refresh 로직 추가

**핵심 개념 — 왜 여기에 넣나:**
모든 API 호출이 이 파일을 거쳐서 나감. 토큰 만료 처리를 여기 한 곳에 넣으면
API가 100개가 생겨도 각 파일에서 refresh 걱정을 안 해도 됨. (인터셉터 패턴)

**추가된 흐름:**

```
API 요청 → 401/403 수신
    ↓
refreshToken으로 새 accessToken 자동 요청
    ↓ 성공              ↓ 실패
원래 요청 재시도     로그아웃 + 로그인 페이지
```

**작성 시 주의했던 버그:**

```ts
// ❌ 상태코드는 숫자 — 따옴표 쓰면 조건이 절대 true가 안 됨
response.status === '401'

// ✅ 올바른 방식
response.status === 401
```

```ts
// ❌ headers가 undefined면 이 안으로 안 들어감
if (options.headers) {
  options.headers.set('Authorization', `Bearer ${token}`)
}

// ✅ headers 없으면 먼저 생성
if (!options.headers) options.headers = new Headers()
if (options.headers instanceof Headers) {
  options.headers.set('Authorization', `Bearer ${token}`)
}
```

```ts
// ❌ 이게 없으면 httpOnly 쿠키(refreshToken)가 요청에 안 실림
$fetch('/auth/refresh', {method: 'POST'})

// ✅ credentials: 'include' 필수
$fetch('/auth/refresh', {
  method: 'POST',
  credentials: 'include'
})
```

---

### 6. `pages/login.vue` — 로그인 후 리다이렉트 추가

```ts
// 로그인 성공 후 userType에 따라 올바른 대시보드로 이동
if (data.userType === USER_TYPE.DEALER) {
  await navigateTo('/dealer/dashboard')
}
```

---

## 오늘 헷갈렸던 개념 정리

### Q1. 로그인 여부 체크(리다이렉트)는 페이지에서 하나요, 미들웨어에서 하나요?

**미들웨어에서 하는 게 맞아요.**

- 페이지 컴포넌트: 실제 기능 담당 (로그인 API 호출, 데이터 표시 등)
- 미들웨어: 페이지 진입 전 권한 체크 담당

페이지에 직접 넣으면 페이지마다 같은 코드가 반복되고, 미들웨어에 넣으면 한 곳에서 통합 관리 가능.

---

### Q2. `auth.ts`와 `guest.ts`를 왜 두 파일로 안 나눴나요?

| 방식                 | 설명                                                     |
| -------------------- | -------------------------------------------------------- |
| 두 파일              | `auth.ts` (보호 페이지용) + `guest.ts` (로그인 페이지용) |
| 한 파일 `.global.ts` | 모든 페이지에 자동 적용, 파일 안에서 케이스 분기         |

로그인 페이지 제외 모든 페이지가 auth 보호 대상이라서 **글로벌 미들웨어 하나가 더 효율적**이었음.

---

### Q3. 403이 뜨는데 refresh를 타도 계속 403이에요

403은 두 가지 의미가 있음:

```
403 = 권한 없음 (이 계정은 이 API를 못 씀)  ← refresh해도 해결 안 됨
403 = 토큰 만료                              ← refresh하면 해결됨
```

DEALER 계정으로 `/auth/me`를 호출했을 때 403이 뜬 것은 **권한 없음** 이었음.
refresh 테스트는 DEALER가 실제로 접근 가능한 API로 해야 함.

---

### Q4. refresh 테스트 방법

```
1. 로그인 (정상 상태 확인)
2. DevTools → Application → Cookies → accessToken 값을 "abc"로 변조
3. API 호출 버튼 클릭
4. 콘솔에서 refresh 로그 확인
```

---

## 토큰 전체 흐름 요약

```
[로그인]
POST /api/auth/login
↓
accessToken  → 일반 쿠키 저장 (setCookie로 JS에서 직접 저장)
refreshToken → httpOnly 쿠키 (백엔드 자동 세팅, JS 접근 불가)
authStore    → 전역 상태에 사용자 정보 저장

[이후 모든 API 요청]
useClientFetch → Authorization: Bearer {accessToken} 자동 삽입

[토큰 만료 시 — 401/403]
POST /api/auth/refresh
→ refreshToken은 브라우저가 자동 전송 (credentials: 'include')
→ 성공: 새 accessToken → 원래 요청 재시도
→ 실패: setLogout() + 로그인 페이지 이동

[로그아웃]
POST /api/auth/logout
→ authStore.setLogout() 호출
→ /dealer/login으로 이동
```

---

## 나중에 추가할 것

```
□ ADMIN, COMPANY 포털 대시보드 페이지
□ middleware/auth.global.ts에 ADMIN, COMPANY 분기 추가
□ 각 포털별 로그인 페이지 (/company/login, /admin/login 등)
□ useClientFetch.ts — refreshPromise dedupe 로직 추가
   (동시 다발 401 발생 시 refresh 중복 호출 방지)
```
