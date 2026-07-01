# API 연동 가이드 (신규 Nuxt 3 프로젝트용)

> BHM 백엔드 API를 새 프로젝트에서 연동할 때 참고하는 문서  
> API 정의서: `API_SPEC.md` 함께 참고

---

## 구현 순서

```
1. nuxt.config.ts    → 프록시 설정 (CORS 해결)
2. .env              → 서버 주소 환경변수
3. types/response.ts → API 응답 공통 타입
4. types/auth.ts     → 로그인 관련 타입
5. utils/cookie.ts   → 쿠키 읽기/쓰기
6. composables/useCustomFetch.ts → fetch 래퍼 (토큰 자동 삽입)
7. composables/useLoginApi.ts    → 로그인 API 호출
8. stores/authStore.ts           → 전역 로그인 상태 (Pinia)
9. pages/login.vue               → 로그인 화면
```

---

## 1단계: 프록시 설정

### 프록시가 필요한 이유 (CORS)

브라우저는 **다른 주소의 서버에 직접 요청하는 것을 막습니다** (보안 정책 = CORS).

```
내 사이트: http://localhost:3000
백엔드:    http://192.168.0.99:8080   ← 주소 다름 → 브라우저가 차단
```

**해결책이 프록시** — Nuxt가 중간 우체부 역할:

```
브라우저 → localhost:3000/api/auth/login  (같은 주소라 안전)
                ↓
           Nuxt가 대신 전달
                ↓
           192.168.0.99/api/auth/login (백엔드)
```

### `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseURL: process.env.API_BASE_URL_CLIENT
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://localhost:8080',
        changeOrigin: true // 요청 헤더의 origin을 target 주소로 교체
      }
    }
  }
})
```

---

## 2단계: 환경변수

> 서버 주소를 코드에 직접 쓰면 개발/운영 환경마다 코드를 수정해야 함 → 환경변수로 분리

프로젝트 루트에 `.env` 파일 생성:

```bash
# .env
API_BASE_URL_CLIENT=/api
API_PROXY_TARGET=http://192.168.0.99
```

> ⚠️ `.env`는 절대 git에 올리면 안 됨 → `.gitignore`에 `.env` 추가 필수

---

## 3단계: 타입 정의

### 왜 필요한가

TypeScript를 쓰는 핵심 이유. API가 어떤 모양의 데이터를 줄지 "계약서"를 써두면:

- 자동완성 제공
- 오타 즉시 에러 표시 (실행 전에 잡힘)

### `types/response.ts`

```ts
// 모든 API 응답의 공통 구조
export interface BaseResponse {
  success: boolean
  message: string
  httpStatus: number
}

// 단건 응답: data가 하나의 객체
// 예) { success: true, data: { name: "홍길동" } }
export interface SingleResponse<T> extends BaseResponse {
  data: T
}

// 목록 응답: data가 배열
export interface ListResponse<T> extends BaseResponse {
  data: T[]
}

// 페이지네이션 응답 (목록 + 페이지 정보)
export interface PaginationResponse<T> extends BaseResponse {
  data: T[]
  pageInfo: {
    totalPages: number
    totalElements: number
    pageNumber: number
    pageSize: number
    first: boolean
    last: boolean
    empty: boolean
  }
}
```

### `types/auth.ts`

```ts
// 로그인 요청 body
export interface LoginRequest {
  contactNo: string // 연락처 (로그인 ID)
  password: string
}

// 로그인 성공 응답의 data 부분
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  managerId: string
  managerName: string
  userType: 'ADMIN' | 'COMPANY' | 'DEALER'
  orgNm: string
  orgNo: string
  roleCd: string
  expiresIn: number // 토큰 유효 시간(초)
}
```

---

## 4단계: 쿠키 유틸리티

### 토큰을 쿠키에 저장하는 이유

| 저장 방법    | 새로고침 유지 | 보안                             |
| ------------ | ------------- | -------------------------------- |
| 변수(메모리) | ❌ 사라짐     | -                                |
| localStorage | ✅            | XSS 공격에 취약                  |
| **쿠키**     | ✅            | httpOnly 옵션으로 보안 강화 가능 |

토큰은 **쿠키 저장이 업계 표준**.

### `utils/cookie.ts`

```ts
// 쿠키 저장
// expireSec: 유효 시간(초). 예) 1800 = 30분
export const setCookie = (name: string, value: string, expireSec: number) => {
  document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';path=/;Max-Age=' + expireSec + ';'
}

// 쿠키 읽기 (Nuxt의 useCookie 활용 — SSR/CSR 모두 동작)
export const getCookie = (key: string): string | null | undefined => {
  return useCookie(key).value
}

// 쿠키 삭제 (Max-Age=0 으로 즉시 만료)
export const removeCookie = (name: string) => {
  document.cookie = name + '=; path=/; Max-Age=0'
}
```

---

## 5단계: fetch 래퍼

### 래퍼가 필요한 이유

모든 API 호출마다 아래를 반복하면 중복 코드 폭발:

```ts
// ❌ 이걸 API 수십 개마다 반복?
const token = getCookie('accessToken')
const response = await fetch('/api/users', {
  headers: {Authorization: `Bearer ${token}`}
})
if (response.status === 401) {
  /* 토큰 갱신... */
}
```

래퍼로 공통 처리를 한 곳에 모으면:

```ts
// ✅ 호출할 때는 이것만
const data = await useClientFetch.get('/api/users')
```

### `composables/useCustomFetch.ts`

```ts
// 모든 요청에 공통 헤더를 삽입하는 내부 함수
const setCommonHeaders = (options: any) => {
  const token = getCookie('accessToken')
  if (token) {
    if (!options.headers) options.headers = new Headers()
    if (options.headers instanceof Headers) {
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  }
}

export const useClientFetch = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    return $fetch<T>(url, {
      method: 'GET',
      params,
      baseURL: useRuntimeConfig().public.apiBaseURL,
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })
  },

  post: async <T>(url: string, body?: object | FormData): Promise<T> => {
    return $fetch<T>(url, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      baseURL: useRuntimeConfig().public.apiBaseURL,
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })
  },

  put: async <T>(url: string, body?: object): Promise<T> => {
    return $fetch<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      baseURL: useRuntimeConfig().public.apiBaseURL,
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })
  },

  delete: async <T>(url: string, body?: object): Promise<T> => {
    return $fetch<T>(url, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
      baseURL: useRuntimeConfig().public.apiBaseURL,
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })
  },

  patch: async <T>(url: string, body?: object): Promise<T> => {
    return $fetch<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
      baseURL: useRuntimeConfig().public.apiBaseURL,
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })
  }
}
```

> 나중에 `401/403` 응답 시 자동 refresh 로직을 여기에 추가

---

## 6단계: 로그인 API composable

### `composables/useLoginApi.ts`

```ts
import type {SingleResponse} from '~/types/response'
import type {LoginRequest, LoginResponse} from '~/types/auth'

export const useLoginApi = {
  /** 로그인: POST /api/auth/login */
  login: (params: LoginRequest) => useClientFetch.post<SingleResponse<LoginResponse>>('/auth/login', params),

  /** 로그아웃: POST /api/auth/logout */
  logout: () => useClientFetch.post<SingleResponse<string>>('/auth/logout', {})
}
```

---

## 7단계: Auth Store (전역 로그인 상태)

### Pinia Store가 필요한 이유

로그인 후 **"지금 누가 로그인했는지"** 를 앱 전체에서 알아야 함:

- 헤더: "홍길동님 환영합니다" 표시
- 메뉴: 권한에 맞는 항목만 표시
- API 호출: 토큰 읽기

이 정보를 props로 컴포넌트마다 전달하면 유지보수 지옥 → **Store = 전역 변수 창고**

### `stores/authStore.ts`

```ts
import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    managerId: '',
    managerName: '',
    userType: '' as '' | 'ADMIN' | 'COMPANY' | 'DEALER',
    orgNm: '',
    orgNo: '' as string | null,
    accessToken: ''
  }),

  actions: {
    setLogin(data: {
      managerId: string
      managerName: string
      userType: 'ADMIN' | 'COMPANY' | 'DEALER'
      orgNm?: string
      orgNo?: string | null
      accessToken: string
    }) {
      this.isLoggedIn = true
      this.managerId = data.managerId
      this.managerName = data.managerName
      this.userType = data.userType
      this.orgNm = data.orgNm ?? ''
      this.orgNo = data.orgNo ?? ''
      this.accessToken = data.accessToken
    },

    logout() {
      this.isLoggedIn = false
      this.managerId = ''
      this.managerName = ''
      this.userType = ''
      this.orgNm = ''
      this.orgNo = ''
      this.accessToken = ''

      if (import.meta.client) {
        // JS로 제거 가능한 일반 쿠키만 삭제
        // httpOnly refreshToken은 백엔드가 /api/auth/logout 호출 시 만료 처리
        document.cookie = 'accessToken=; path=/; Max-Age=0'
      }
    }
  },

  // persist: true → 새로고침해도 store 상태 유지 (pinia-plugin-persistedstate 필요)
  persist: true
})
```

#### pinia-plugin-persistedstate 설치 (store 새로고침 유지)

```bash
npm install pinia-plugin-persistedstate
```

`nuxt.config.ts` modules에 추가:

```ts
modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt']
```

---

## 8단계: 로그인 페이지

### `pages/login.vue`

```vue
<script setup lang="ts">
const form = reactive({
  contactNo: '',
  password: ''
})

const errorMsg = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  errorMsg.value = ''

  try {
    const res = await useLoginApi.login(form)

    if (res.success) {
      // accessToken을 쿠키에 저장 (30분 = 1800초)
      setCookie('accessToken', res.data.accessToken, res.data.expiresIn || 1800)
      // refreshToken은 백엔드가 httpOnly 쿠키로 자동 세팅 (JS에서 건드릴 수 없음)

      // 전역 store에 로그인 정보 저장
      authStore.setLogin({
        managerId: res.data.managerId,
        managerName: res.data.managerName,
        userType: res.data.userType,
        orgNm: res.data.orgNm,
        orgNo: res.data.orgNo,
        accessToken: res.data.accessToken
      })

      // 포털(역할)에 따라 다른 대시보드로 이동
      if (res.data.userType === 'ADMIN') {
        await navigateTo('/admin/dashboard')
      } else if (res.data.userType === 'COMPANY') {
        await navigateTo('/company/dashboard')
      } else if (res.data.userType === 'DEALER') {
        await navigateTo('/dealer/dashboard')
      }
    }
  } catch (err: any) {
    const status = err?.response?.status
    if (status === 401) {
      // 로그인 API의 401은 ID/PW 불일치 → 리다이렉트 없이 메시지만 표시
      errorMsg.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
    } else {
      errorMsg.value = '로그인 중 오류가 발생했습니다.'
    }
  }
}
</script>

<template>
  <div>
    <input v-model="form.contactNo" placeholder="연락처 (010-xxxx-xxxx)" />
    <input v-model="form.password" type="password" placeholder="비밀번호" />
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
    <button @click="handleLogin">로그인</button>
  </div>
</template>
```

---

## 토큰 흐름 전체 요약

```
[로그인]
  POST /api/auth/login
  ↓ 응답
  accessToken  → 일반 쿠키에 저장  (JS에서 읽기 가능)
  refreshToken → httpOnly 쿠키     (JS 접근 불가, 브라우저 자동 전송)

[이후 모든 API 요청]
  Header: Authorization: Bearer {accessToken}

[401 또는 403 수신 시] ← accessToken 만료
  POST /api/auth/refresh
  → refreshToken은 httpOnly 쿠키라 헤더 불필요, 브라우저가 자동 전송
  → 성공: 새 accessToken 발급 → 원래 요청 1회 재시도
  → 실패: 로그아웃 + 로그인 페이지 이동
```

---

## 10단계: 401/403 자동 refresh (fetch 래퍼 업그레이드)

### 왜 필요한가

accessToken은 30분 뒤 만료됩니다. 만료된 채로 API를 호출하면 서버는 `401` 또는 `403`을 반환합니다.
매번 로그인 페이지로 보내면 사용자 경험이 나쁘기 때문에, **refreshToken을 써서 새 accessToken을 자동으로 받아온 뒤 원래 요청을 다시 보냅니다.**

```
API 요청
  ↓
401/403 수신 (accessToken 만료)
  ↓
POST /api/auth/refresh (refreshToken은 httpOnly 쿠키라 브라우저가 자동 전송)
  ↓ 성공          ↓ 실패
원래 요청 재시도   로그아웃 + 로그인 페이지 이동
```

### 동시 요청 중복 방지 (dedupe)

여러 API가 동시에 401을 받으면 refresh가 여러 번 호출될 수 있습니다.
이를 방지하기 위해 **모듈 전역 Promise 변수**로 refresh를 단 1회만 실행합니다.

```ts
let refreshPromise: Promise<boolean> | null = null // ← 파일 최상단 (함수 밖)
```

### `composables/useCustomFetch.ts` (전체 교체)

```ts
// ── 모듈 전역: 동시 401 dedupe용
let refreshPromise: Promise<boolean> | null = null

// 토큰 헤더 삽입
const setCommonHeaders = (options: any) => {
  const token = getCookie('accessToken')
  if (token) {
    if (!options.headers) options.headers = new Headers()
    if (options.headers instanceof Headers) {
      options.headers.set('Authorization', `Bearer ${token}`)
    }
  }
}

// refresh 토큰으로 새 accessToken 요청 (dedupe 포함)
const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = $fetch('/auth/refresh', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.apiBaseURL,
      credentials: 'include'
    })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// 로그인/refresh API는 재시도 대상에서 제외 (무한루프 방지)
const isAuthEndpoint = (url: string): boolean => url.includes('/auth/refresh') || url.includes('/auth/login')

// 포털별 로그인 페이지로 이동 (현재 경로 기준)
const redirectToLogin = () => {
  const authStore = useAuthStore()
  authStore.logout()

  if (!import.meta.client) {
    navigateTo('/login')
    return
  }

  const path = window.location.pathname
  if (path.startsWith('/company/')) {
    navigateTo('/company/login')
  } else if (path.startsWith('/dealer/')) {
    navigateTo('/dealer/login')
  } else if (path.startsWith('/mobile/')) {
    navigateTo('/mobile/login')
  } else {
    navigateTo('/login')
  }
}

export const useClientFetch = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    return request<T>('GET', url, params)
  },
  post: async <T>(url: string, body?: object | FormData): Promise<T> => {
    return request<T>('POST', url, body)
  },
  put: async <T>(url: string, body?: object): Promise<T> => {
    return request<T>('PUT', url, body)
  },
  delete: async <T>(url: string, body?: object): Promise<T> => {
    return request<T>('DELETE', url, body)
  },
  patch: async <T>(url: string, body?: object): Promise<T> => {
    return request<T>('PATCH', url, body)
  }
}

// 실제 $fetch 실행 + 401/403 시 refresh → 재시도
const request = async <T>(method: string, url: string, params?: object | FormData): Promise<T> => {
  const config = useRuntimeConfig()
  const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

  const runFetch = () =>
    $fetch<T>(url, {
      method: method as any,
      baseURL: config.public.apiBaseURL,
      ...(isBodyMethod ? {body: params instanceof FormData ? params : params} : {params}),
      onRequest({options}) {
        setCommonHeaders(options)
      }
    })

  try {
    return await runFetch()
  } catch (err: any) {
    const status = err?.response?.status

    if (import.meta.client && (status === 401 || status === 403) && !isAuthEndpoint(url)) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        return await runFetch() // 재시도 1회
      }
      // refresh도 실패 → 세션 완전 만료
      redirectToLogin()
      return new Promise<never>(() => {})
    }

    throw err
  }
}
```

---

## 11단계: 페이지 보호 미들웨어

### 미들웨어란

Nuxt에서 미들웨어는 **페이지 이동 직전에 실행되는 코드**입니다.
로그인 여부를 확인해서, 로그인 안 된 사용자가 보호된 페이지에 접근하면 로그인 페이지로 보냅니다.

```
사용자가 /admin/dashboard 이동 시도
  ↓
middleware/auth.ts 실행
  ↓ 로그인 안됨    ↓ 로그인 됨
/login으로 이동   페이지 정상 표시
```

### `middleware/auth.ts`

```ts
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isLoggedIn) {
    // 현재 접근하려는 경로 기준으로 로그인 페이지 결정
    const path = to.path
    if (path.startsWith('/company/')) {
      return navigateTo('/company/login')
    } else if (path.startsWith('/dealer/')) {
      return navigateTo('/dealer/login')
    } else if (path.startsWith('/mobile/')) {
      return navigateTo('/mobile/login')
    } else {
      return navigateTo('/login')
    }
  }
})
```

### 각 페이지에 미들웨어 적용

보호할 페이지 상단에 아래 코드를 추가합니다:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth' // middleware/auth.ts를 실행
})
</script>
```

예시 — `/admin/dashboard/index.vue`:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1>{{ authStore.managerName }}님 환영합니다</h1>
  </div>
</template>
```

### 로그인 페이지는 이미 로그인한 사용자를 튕겨야 함

로그인된 사람이 `/login`으로 다시 오면 대시보드로 보내줍니다:

```vue
<!-- pages/login.vue -->
<script setup lang="ts">
const authStore = useAuthStore()

// 이미 로그인 상태면 대시보드로
if (authStore.isLoggedIn) {
  if (authStore.userType === 'ADMIN') await navigateTo('/admin/dashboard')
  else if (authStore.userType === 'COMPANY') await navigateTo('/company/dashboard')
  else if (authStore.userType === 'DEALER') await navigateTo('/dealer/dashboard')
}
</script>
```

---

## 12단계: API composable 확장

### 패턴: 기능별로 composable 파일 분리

API가 많아지면 `useLoginApi.ts` 하나에 다 쓰지 않고, 기능별로 파일을 나눕니다.

```
composables/
├── useLoginApi.ts        ← 인증 (이미 완성)
├── useMenuApi.ts         ← 메뉴/화면
├── useAdminApi.ts        ← 관리자 관리
├── useCompanyApi.ts      ← 상장업체 관리
├── useDealerApi.ts       ← 중도매인 관리
├── useAuctionApi.ts      ← 경매
└── useSettlementApi.ts   ← 정산
```

### 예시 1: `composables/useMenuApi.ts`

```ts
import type {ListResponse, SingleResponse} from '~/types/response'

// 메뉴 트리 항목 타입
interface MenuTreeItem {
  menuNumber: string
  menuName: string
  menuUrl: string
  children?: MenuTreeItem[]
}

export const useMenuApi = {
  /** GET /api/menu/tree — 메뉴 트리 조회 */
  getTree: (params?: {menuLargeCode?: string; useYn?: string}) =>
    useClientFetch.get<ListResponse<MenuTreeItem>>('/menu/tree', params),

  /** GET /api/menu/accessible-urls — 현재 사용자 접근 가능 URL 목록 */
  getAccessibleUrls: () => useClientFetch.get<ListResponse<string>>('/menu/accessible-urls'),

  /** POST /api/menu/access-log — 메뉴 접근 로그 저장 */
  logAccess: (menuNumber: string) => useClientFetch.post<SingleResponse<void>>('/menu/access-log', {menuNumber})
}
```

### 예시 2: `composables/useAdminApi.ts`

```ts
import type {PaginationResponse, SingleResponse} from '~/types/response'

interface AdminUser {
  contactNo: string
  managerName: string
  statusCd: string
  adminRole: string
}

interface AdminListParams {
  keyword?: string
  statusCd?: string
  adminRole?: string
  page?: number
  size?: number
}

export const useAdminApi = {
  /** GET /api/admin/admins — 목록 조회 (ADM_001) */
  getList: (params?: AdminListParams) => useClientFetch.get<PaginationResponse<AdminUser>>('/admin/admins', params),

  /** GET /api/admin/admins/check — 연락처 중복 체크 (ADM_002) */
  checkContact: (contactNo: string) => useClientFetch.get<SingleResponse<boolean>>('/admin/admins/check', {contactNo}),

  /** POST /api/admin/admins — 신규 등록 (ADM_003) */
  create: (data: object) => useClientFetch.post<SingleResponse<void>>('/admin/admins', data),

  /** PUT /api/admin/admins/{contactNo} — 정보 수정 (ADM_004) */
  update: (contactNo: string, data: object) =>
    useClientFetch.put<SingleResponse<void>>(`/admin/admins/${contactNo}`, data),

  /** PATCH /api/admin/admins/{contactNo}/status — 상태 변경 (ADM_005) */
  changeStatus: (contactNo: string, statusCd: string) =>
    useClientFetch.patch<SingleResponse<void>>(`/admin/admins/${contactNo}/status`, {statusCd})
}
```

### 예시 3: 공통코드 조회 (여러 코드 동시 조회)

```ts
// composables/useCommonCodeApi.ts
import type {PaginationResponse} from '~/types/response'

interface CommonCode {
  groupCode: string
  commonCode: string
  commonCodeName: string
  sortOrder: number
  useYn: string
}

export const useCommonCodeApi = {
  /** GET /api/common/codes/{groupCode}/details */
  getByGroup: (groupCode: string) =>
    useClientFetch.get<PaginationResponse<CommonCode>>(`/common/codes/${groupCode}/details`, {page: 0, size: 1000}),

  /** 여러 그룹코드를 한번에 조회 (병렬 처리) */
  getMultiple: (groupCodes: string[]) => Promise.all(groupCodes.map((code) => useCommonCodeApi.getByGroup(code)))
}
```

사용 예시:

```ts
// 성별, 등급, 품종 코드를 한번에 조회
const [genderCodes, gradeCodes, breedCodes] = await useCommonCodeApi.getMultiple([
  'CD00006', // 성별
  'CD00007', // 등급
  'CD00008' // 품종
])
```

### 예시 4: 엑셀/파일 다운로드

```ts
/** GET /api/admin/admins/excel — 엑셀 다운로드 */
downloadExcel: (params?: AdminListParams) =>
  useClientFetch.get<Blob>('/admin/admins/excel', params),
```

페이지에서 사용:

```ts
const handleExcelDownload = async () => {
  const blob = await useAdminApi.downloadExcel({keyword: '홍길동'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '관리자목록.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
```

---

## 전체 구현 순서 (최종)

```
✅ 1. nuxt.config.ts       → 프록시 설정
✅ 2. .env                 → 환경변수
✅ 3. types/response.ts    → API 응답 타입
✅ 4. types/auth.ts        → 로그인 타입
✅ 5. utils/cookie.ts      → 쿠키 유틸
✅ 6. composables/useCustomFetch.ts  → fetch 래퍼 (refresh 포함)
✅ 7. composables/useLoginApi.ts     → 로그인 API
✅ 8. stores/authStore.ts            → 전역 로그인 상태
✅ 9. pages/login.vue                → 로그인 화면
✅ 10. middleware/auth.ts            → 페이지 보호
   11. composables/use*Api.ts        → 기능별 API 추가
```
