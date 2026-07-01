# BHM 프로젝트 API 정의서

**문서 버전**: v2.1  
**Base URL**: `http://{server}/api`  
**최종 수정일**: 2026-06-18

---

## 목차

1. [공통 사항](#1-공통-사항)
2. [인증 API](#2-인증-api)
3. [메뉴 / 화면 API](#3-메뉴--화면-api)
4. [회원 관리 API](#4-회원-관리-api)
5. [경매 API](#5-경매-api)
6. [권한 관리 API](#6-권한-관리-api)
7. [정산 API](#7-정산-api)
8. [공통코드 API](#8-공통코드-api)
9. [WebSocket](#9-websocket-실시간-경매)
10. [파일 업로드 규칙](#10-파일-업로드-규칙)
11. [에러 코드 처리 기준](#11-에러-코드-처리-기준)

---

## 1. 공통 사항

### 1-1. Base URL 구성

| 환경 | Client (브라우저)                                  | Server (SSR)            |
| ---- | -------------------------------------------------- | ----------------------- |
| 로컬 | `/api` → 프록시 → `http://localhost:8080`          | `http://localhost:8080` |
| 개발 | `/api` → 프록시 → `http://192.168.0.99` (nginx 80) | `http://192.168.0.99`   |

> **주의**: 브라우저는 항상 `/api` 상대경로로 호출. 백엔드 8080 직결 금지 (nginx 경유 필수)

---

### 1-2. 공통 요청 헤더

```
Authorization: Bearer {accessToken}
Content-Type: application/json
Referer: {현재 페이지 경로}
```

SSR 전용 추가 헤더:

```
RefreshToken: {refreshToken}
```

---

### 1-3. 공통 응답 구조

모든 응답은 아래 3가지 형태 중 하나입니다.

**단건 응답 `SingleResponse<T>`**

```json
{
  "success": true,
  "message": "",
  "httpStatus": 200,
  "data": {}
}
```

**목록 응답 `ListResponse<T>`**

```json
{
  "success": true,
  "message": "",
  "httpStatus": 200,
  "data": []
}
```

**페이지네이션 응답 `PaginationResponse<T>`**

```json
{
  "success": true,
  "message": "",
  "httpStatus": 200,
  "data": [],
  "pageInfo": {
    "totalPages": 0,
    "totalElements": 0,
    "pageNumber": 0,
    "pageSize": 10,
    "offset": 0,
    "first": true,
    "last": false,
    "numberOfElements": 0,
    "empty": false,
    "size": 10,
    "number": 0
  }
}
```

---

### 1-4. 인증 (토큰) 처리 흐름

```
1. 로그인 → accessToken + refreshToken 발급 (쿠키 저장)
2. 매 API 요청 헤더에 → Authorization: Bearer {accessToken}
3. 401/403 응답 수신 시 → POST /api/auth/refresh 자동 호출
4. 재발급 성공 → 원래 요청 1회 재시도
5. 재발급 실패 → 로그아웃 + 해당 포털 로그인 페이지 이동
```

> **쿠키 보안**: `refreshToken`은 httpOnly 쿠키 (JS 접근 불가, 브라우저 자동 전송)  
> **동시 요청 처리**: 동시 다발 401은 refresh 1회로 dedupe 처리

---

### 1-5. 포털별 사용자 유형 (userType)

| 포털     | userType  | 로그인 경로      | 대시보드             |
| -------- | --------- | ---------------- | -------------------- |
| 관리자   | `ADMIN`   | `/login`         | `/admin/dashboard`   |
| 상장업체 | `COMPANY` | `/company/login` | `/company/dashboard` |
| 중도매인 | `DEALER`  | `/dealer/login`  | `/dealer/dashboard`  |
| 모바일   | `DEALER`  | `/mobile/login`  | `/mobile/dashboard`  |

---

## 2. 인증 API

**Base**: `/api/auth`

---

### POST `/api/auth/login` — 로그인

**요청**

```json
{
  "contactNo": "010-1234-5678",
  "password": "비밀번호"
}
```

> `managerId` 필드도 허용 (구버전 호환)

**응답** `SingleResponse<LoginResponse>`

```json
{
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "managerId": "010-1234-5678",
    "managerName": "홍길동",
    "userType": "ADMIN",
    "orgNm": "중앙도매시장",
    "orgNo": "001",
    "roleCd": "MASTER_ADMIN",
    "expiresIn": 1800
  }
}
```

> **에러**: 401 → ID/PW 불일치 (로그인 페이지에서 에러 메시지만 표시, 리다이렉트 없음)

---

### POST `/api/auth/logout` — 로그아웃

**요청**: `{}` (빈 body)  
**응답**: `SingleResponse<string>`

---

### POST `/api/auth/refresh` — 토큰 재발급

**요청**: body 없음 (브라우저가 httpOnly refreshToken 쿠키 자동 전송)  
**응답**: 새 accessToken을 httpOnly 쿠키로 재발급 (응답 body 없음)

---

### GET `/api/auth/me` — 현재 사용자 정보

**응답** `SingleResponse<LoginMeResponse>`

```json
{
  "data": {
    "staffContactNo": "010-1234-5678",
    "staffNm": "홍길동",
    "userType": "ADMIN",
    "orgNm": "중앙도매시장",
    "orgNo": "001",
    "roleCd": "MASTER_ADMIN",
    "lastLoginDt": "2026-06-18T09:00:00",
    "lastLoginIp": "192.168.0.1"
  }
}
```

---

### POST `/api/auth/find-id` — 아이디(연락처) 찾기

**요청**

```json
{"name": "홍길동", "phone": "010-1234-5678"}
```

**응답** `SingleResponse<{ managerId: string }>`

---

### POST `/api/auth/reset-password` — 비밀번호 초기화

**요청**

```json
{"managerId": "010-1234-5678", "phone": "010-1234-5678"}
```

**응답** `SingleResponse<{ temporaryPassword: string }>`

---

### POST `/api/auth/sms/send` — SMS 인증번호 발송

**요청**: `{ "managerId": "010-1234-5678" }`

---

### POST `/api/auth/sms/resend` — SMS 재발송

**요청**: `{ "managerId": "010-1234-5678" }`

---

### POST `/api/auth/sms/verify` — SMS 인증번호 확인

**요청**

```json
{"managerId": "010-1234-5678", "code": "123456"}
```

**응답** `SingleResponse<{ accessToken, refreshToken, managerName, roleCode }>`

---

## 3. 메뉴 / 화면 API

**Base**: `/api/menu`

### 메뉴

| 메서드 | 경로                        | 설명                           |
| ------ | --------------------------- | ------------------------------ |
| GET    | `/api/menu/tree`            | 메뉴 트리 조회                 |
| GET    | `/api/menu/accessible-urls` | 현재 사용자 접근 가능 URL 목록 |
| GET    | `/api/menu`                 | 전체 메뉴 목록                 |
| GET    | `/api/menu/next-number`     | 다음 메뉴 번호 조회            |
| POST   | `/api/menu`                 | 메뉴 생성                      |
| PUT    | `/api/menu/{menuNumber}`    | 메뉴 수정                      |
| DELETE | `/api/menu/{menuNumber}`    | 메뉴 삭제                      |
| PUT    | `/api/menu/reorder`         | 메뉴 순서 변경                 |
| POST   | `/api/menu/access-log`      | 메뉴 접근 로그 저장            |

**메뉴 트리 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| menuLargeCode | string | 대분류 코드 (선택) |
| useYn | string | 사용여부 Y/N (선택) |

---

### 화면 (Screen)

| 메서드 | 경로                           | 설명                     |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/menu/screens`            | 화면 목록 (페이지네이션) |
| POST   | `/api/menu/screens`            | 화면 생성                |
| PUT    | `/api/menu/screens/{screenId}` | 화면 수정                |
| DELETE | `/api/menu/screens/{screenId}` | 화면 삭제                |

---

### 메뉴-화면 매핑

| 메서드 | 경로                                                     | 설명             |
| ------ | -------------------------------------------------------- | ---------------- |
| GET    | `/api/menu/{menuNumber}/screens`                         | 메뉴별 화면 목록 |
| GET    | `/api/menu/menu-screen-mappings`                         | 매핑 전체 목록   |
| POST   | `/api/menu/menu-screen-mappings`                         | 매핑 생성        |
| DELETE | `/api/menu/menu-screen-mappings/{menuNumber}/{screenId}` | 매핑 삭제        |
| PUT    | `/api/menu/menu-screen-mappings/reorder`                 | 매핑 순서 변경   |

---

## 4. 회원 관리 API

### 4-1. 관리자 관리

**Base**: `/api/admin/admins`

| ID      | 메서드 | 경로                                    | 설명                           |
| ------- | ------ | --------------------------------------- | ------------------------------ |
| ADM_001 | GET    | `/api/admin/admins`                     | 목록 조회                      |
| ADM_002 | GET    | `/api/admin/admins/check`               | 연락처 중복 체크               |
| ADM_003 | POST   | `/api/admin/admins`                     | 신규 등록                      |
| ADM_004 | PUT    | `/api/admin/admins/{contactNo}`         | 정보 수정                      |
| ADM_005 | PATCH  | `/api/admin/admins/{contactNo}/status`  | 상태 변경 (ACTIVE/INACTIVE)    |
| ADM_006 | GET    | `/api/admin/admins/excel`               | 엑셀 다운로드 (Blob)           |
| ADM_007 | PUT    | `/api/admin/admins/{contactNo}/role`    | 권한 변경 (MASTER_ADMIN/ADMIN) |
| ADM_008 | POST   | `/api/admin/admins/{contactNo}/unlock`  | 계정 잠금해제                  |
| ADM_009 | GET    | `/api/admin/admins/{contactNo}/history` | 이력 조회 (페이지네이션)       |

**ADM_001 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| keyword | string | 검색어 |
| statusCd | string | 상태 코드 |
| adminRole | string | 역할 (MASTER_ADMIN/ADMIN) |
| page | number | 페이지 번호 |
| size | number | 페이지 크기 |

**ADM_002 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| contactNo | string | 확인할 연락처 (010-xxxx-xxxx) |

---

### 4-2. 상장업체 관리

**Base**: `/api/admin/companies`

| ID      | 메서드 | 경로                                                        | 설명                         |
| ------- | ------ | ----------------------------------------------------------- | ---------------------------- |
| CMP_001 | GET    | `/api/admin/companies`                                      | 목록 조회                    |
| CMP_002 | POST   | `/api/admin/companies`                                      | 업체 등록                    |
| CMP_003 | PUT    | `/api/admin/companies/{companyNo}`                          | 업체 수정                    |
| CMP_004 | PATCH  | `/api/admin/companies/{companyNo}/status`                   | 상태 변경                    |
| CMP_005 | GET    | `/api/admin/companies/{companyNo}/staff`                    | 직원 목록                    |
| CMP_006 | POST   | `/api/admin/companies/{companyNo}/staff`                    | 직원 추가                    |
| CMP_007 | PUT    | `/api/admin/companies/{companyNo}/staff/{contactNo}`        | 직원 수정                    |
| CMP_008 | PATCH  | `/api/admin/companies/{companyNo}/staff/{contactNo}/status` | 직원 상태 변경               |
| CMP_009 | GET    | `/api/admin/companies/excel`                                | 엑셀 다운로드 (Blob)         |
| CMP_010 | POST   | `/api/admin/companies/{companyNo}/staff/{contactNo}/unlock` | 직원 잠금해제                |
| CMP_011 | PATCH  | `/api/admin/companies/{companyNo}/staff/{contactNo}/role`   | 직원 역할 변경               |
| CMP_012 | GET    | `/api/admin/companies/{companyNo}/history`                  | 업체 변경이력 (페이지네이션) |

> **CMP_004**: 비활성화 시 소속 직원 연쇄 비활성  
> **CMP_011**: COMPANY_ADMIN ↔ COMPANY_USER, 마지막 활성 대표 보호

---

### 4-3. 중도매인 관리

**Base**: `/api/admin/dealers`

| ID      | 메서드 | 경로                                                     | 설명                      |
| ------- | ------ | -------------------------------------------------------- | ------------------------- |
| DLR_001 | GET    | `/api/admin/dealers`                                     | 목록 조회                 |
| DLR_002 | POST   | `/api/admin/dealers`                                     | 중도매인 등록             |
| DLR_003 | PUT    | `/api/admin/dealers/{dealerNo}`                          | 중도매인 수정             |
| DLR_004 | GET    | `/api/admin/dealers/{dealerNo}/staff`                    | 직원 목록                 |
| DLR_005 | PUT    | `/api/admin/dealers/{dealerNo}/staff/{contactNo}`        | 직원 수정                 |
| DLR_006 | POST   | `/api/admin/dealers/{dealerNo}/staff`                    | 직원 추가                 |
| DLR_007 | PATCH  | `/api/admin/dealers/{dealerNo}/status`                   | 상태 변경                 |
| DLR_008 | PATCH  | `/api/admin/dealers/{dealerNo}/staff/{contactNo}/status` | 직원 상태 변경            |
| DLR_009 | GET    | `/api/admin/dealers/excel`                               | 엑셀 다운로드 (Blob)      |
| DLR_010 | POST   | `/api/admin/dealers/{dealerNo}/staff/{contactNo}/unlock` | 직원 잠금해제             |
| —       | GET    | `/api/admin/dealers/options`                             | 드롭다운 옵션 (LIKE 검색) |

> **DLR_007**: 비활성화 시 소속 직원 연쇄 비활성  
> **options 쿼리**: `?q={keyword}` (미입력 시 전체)

---

## 5. 경매 API

### 5-1. 부분육 상장 관리

**Base**: `/api/auctions/listings`

| 메서드 | 경로                                        | 설명                                     |
| ------ | ------------------------------------------- | ---------------------------------------- |
| POST   | `/api/auctions/listings/search`             | 상장 목록 검색 (필터 body)               |
| POST   | `/api/auctions/listings`                    | 1두 상장 등록                            |
| POST   | `/api/auctions/listings/batch`              | N두 일괄 등록                            |
| POST   | `/api/auctions/listings/parts`              | 부위 상세 조회                           |
| POST   | `/api/auctions/listings/media`              | 사진/증명서 조회                         |
| POST   | `/api/auctions/listings/approve-all`        | 전체 승인                                |
| PATCH  | `/api/auctions/listings/status`             | 상태 변경                                |
| PUT    | `/api/auctions/listings/updateParts`        | 부위 수정 (2차 비밀번호 필요)            |
| PUT    | `/api/auctions/listings/prices`             | 단가 수정 (2차 비밀번호 필요)            |
| DELETE | `/api/auctions/listings`                    | 상장 삭제 (2차 비밀번호 필요, body 전송) |
| GET    | `/api/auctions/listings/companies`          | 상장업체 드롭다운 목록                   |
| POST   | `/api/auctions/listings/{receiptNo}/images` | 이미지/증명서 업로드 (multipart)         |

**상장 목록 검색 — 요청**

```
POST /api/auctions/listings/search?page=0&size=10
```

```json
{
  "startDate": "2026-06-01",
  "endDate": "2026-06-18",
  "companyNo": "001",
  "gradeCd": "A",
  "statusCd": "APPROVED"
}
```

**부위 수정 — 요청 body 주요 필드**

```json
{
  "receiptNo": "접수번호",
  "secPwd": "2차비밀번호",
  "genderCd": "성별코드",
  "gradeCd": "등급코드",
  "carcassWt": 350.5,
  "parts": [{"listingNo": "상장번호", "weight": 12.5, "minPrice": 50000, "listedYn": "Y"}]
}
```

---

### 5-2. 경매 현황 (실시간)

**Base**: `/api/admin/auctions/live`

| ID    | 메서드 | 경로                                                  | 설명                                      |
| ----- | ------ | ----------------------------------------------------- | ----------------------------------------- |
| §2.1  | GET    | `/api/admin/auctions/live`                            | 경매 현황 조회                            |
| §2.2  | GET    | `/api/admin/auctions/live/bids/{listingNo}`           | 입찰 내역 + 변경이력                      |
| §2.3  | POST   | `/api/admin/auctions/live/{auctionSeq}/start`         | 회차 시작                                 |
| §2.4  | POST   | `/api/admin/auctions/live/{auctionSeq}/stop`          | 회차 종료                                 |
| §2.5  | POST   | `/api/admin/auctions/live/{auctionSeq}/finalize`      | 전체 마감                                 |
| §2.7  | PUT    | `/api/admin/auctions/live/bids/{bidId}`               | 입찰가 수정 (2차PW)                       |
| §2.8  | DELETE | `/api/admin/auctions/live/bids/{bidId}`               | 입찰 삭제 (2차PW, soft delete, body 전송) |
| §2.9  | GET    | `/api/admin/auctions/live/{auctionSeq}/close-history` | 마감이력 조회                             |
| §2.10 | GET    | `/api/admin/auctions/live/{auctionSeq}/round-history` | 회차이력 조회                             |
| §2.11 | GET    | `/api/admin/auctions/live/{auctionSeq}/bid-history`   | 입찰 수정/삭제 이력 조회                  |

**§2.1 경매 현황 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| date | string | 조회 날짜 (YYYY-MM-DD) |
| companyNo | string | 상장업체 번호 |
| bidStatus | string | 입찰 상태 필터 (ALL/ACTIVE/CLOSED 등) |
| page | number | 페이지 번호 |
| size | number | 페이지 크기 |

**경매 상태 흐름**

```
DRAFT → APPROVED → ACTIVE → CLOSING → END
```

---

### 5-3. 경락 내역 (권한별 분기)

권한에 따라 호출 경로가 다릅니다.

| 역할    | 경로                             | 비고                             |
| ------- | -------------------------------- | -------------------------------- |
| ADMIN   | GET `/api/admin/auctions/bids`   | companyNo, dealerName 사용 가능  |
| COMPANY | GET `/api/company/auctions/bids` | companyNo 서버에서 JWT 강제 주입 |
| DEALER  | GET `/api/dealer/auctions/bids`  | dealerNo 서버에서 JWT 강제 주입  |

**공통 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| startDate | string | 시작일 (YYYY-MM-DD) |
| endDate | string | 종료일 (YYYY-MM-DD) |
| companyNo | string | 상장업체 번호 (ADMIN만) |
| dealerName | string | 중도매인명 LIKE 검색 (ADMIN만) |
| hideUnsold | boolean | 유찰 숨김 여부 |
| page | number | 페이지 번호 |
| size | number | 페이지 크기 |

> **IDOR 방어**: DEALER/COMPANY는 본인 번호를 서버에서 JWT 기반으로 강제 주입. 클라이언트에서 해당 파라미터 전송 불필요.

---

## 6. 권한 관리 API

**Base**: `/api/authorization`

### 권한그룹

| 메서드 | 경로                                            | 설명                         |
| ------ | ----------------------------------------------- | ---------------------------- |
| GET    | `/api/authorization`                            | 권한그룹 목록 (페이지네이션) |
| POST   | `/api/authorization`                            | 권한그룹 생성                |
| PUT    | `/api/authorization/{authorizationGroupNumber}` | 권한그룹 수정                |
| DELETE | `/api/authorization/{authorizationGroupNumber}` | 권한그룹 삭제                |
| POST   | `/api/authorization/copy`                       | 권한그룹 복사                |

### 권한유형 (Class Code)

| 메서드 | 경로                                         | 설명               |
| ------ | -------------------------------------------- | ------------------ |
| GET    | `/api/authorization/class-codes`             | 권한유형 목록      |
| POST   | `/api/authorization/class-codes`             | 권한유형 생성      |
| PUT    | `/api/authorization/class-codes/{code}`      | 권한유형 수정      |
| DELETE | `/api/authorization/class-codes/{code}`      | 권한유형 삭제      |
| GET    | `/api/authorization/class-codes/parent-list` | 상위 권한유형 목록 |
| GET    | `/api/authorization/class-codes/excel`       | 엑셀 다운로드      |

---

## 7. 정산 API

**Base**: `/api/admin/settlements`

### 정산 항목 설정

| 메서드 | 경로                                   | 설명                      |
| ------ | -------------------------------------- | ------------------------- |
| GET    | `/api/admin/settlements/settings`      | 정산 항목 목록            |
| PUT    | `/api/admin/settlements/settings`      | 정산 항목 일괄 저장       |
| DELETE | `/api/admin/settlements/settings/{id}` | 정산 항목 삭제 (논리삭제) |

> **에러**: 400 (기본항목 삭제 불가), 404, 409 (version 충돌)

---

### 정산서 (상장업체용)

| ID      | 메서드 | 경로                             | 설명                 |
| ------- | ------ | -------------------------------- | -------------------- |
| STL_001 | GET    | `/api/admin/settlements`         | 정산서 목록          |
| STL_002 | GET    | `/api/admin/settlements/summary` | 업체별 요약          |
| STL_003 | GET    | `/api/admin/settlements/detail`  | 접수번호별 부위 상세 |
| STL_006 | GET    | `/api/admin/settlements/excel`   | 엑셀 다운로드 (Blob) |

**STL_001 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| startDate | string | 시작일 (YYYY-MM-DD) |
| endDate | string | 종료일 (YYYY-MM-DD) |
| companyNo | string | 상장업체 번호 (미지정 시 전체) |

**STL_006 쿼리 파라미터**: 위 동일 + `mode` (상세/요약)

---

### 낙찰서 (중도매인용)

| ID         | 메서드 | 경로                                              | 설명                 |
| ---------- | ------ | ------------------------------------------------- | -------------------- |
| SN_STL_010 | GET    | `/api/admin/settlements/dealers`                  | 낙찰서 목록/요약     |
| SN_STL_012 | GET    | `/api/admin/settlements/dealers/excel`            | 엑셀 다운로드 (Blob) |
| SN_STL_014 | POST   | `/api/admin/settlements/dealers/sms`              | 문자 발송            |
| —          | GET    | `/api/admin/settlements/dealers/sms/template`     | SMS 템플릿 조회      |
| SN_STL_016 | GET    | `/api/admin/settlements/dealers/sms/history`      | 전송 이력 목록       |
| —          | GET    | `/api/admin/settlements/dealers/sms/history/{id}` | 전송 이력 상세       |

**SN_STL_010 쿼리 파라미터**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| startDate | string | 시작일 |
| endDate | string | 종료일 |
| dealerKeyword | string | 중도매인 검색어 (미입력 시 전체) |
| summary | boolean | true = 중도매인별 집계 |

**SN_STL_016 쿼리 파라미터**: `page`, `size`

---

## 8. 공통코드 API

| 메서드 | 경로                                    | 설명                    |
| ------ | --------------------------------------- | ----------------------- |
| GET    | `/api/common/codes/{groupCode}/details` | 그룹코드 하위 코드 목록 |

**쿼리 파라미터**: `page=0&size=1000`

**응답 `PaginationResponse<CommonCodeDto>`**

```json
{
  "data": [
    {
      "groupCode": "CD00006",
      "commonCode": "CODE01",
      "commonCodeName": "코드명",
      "commonCodeDescription": "설명",
      "sortOrder": 1,
      "useYn": "Y"
    }
  ]
}
```

> **관례**: 여러 그룹코드를 한 번에 조회할 때 `Promise.all`로 병렬 호출 처리

---

## 9. WebSocket (실시간 경매)

**경로 prefix**: `/ws/...` (SockJS)

```
http://{server}/ws/auctions/...
```

- SockJS 핸드셰이크는 HTTP GET으로 시작 (ws: 프로토콜 아님)
- 운영 환경에서는 nginx가 WebSocket upgrade 처리
- 미인증 사용자도 경매 현황 구독 가능 (읽기 전용)

---

## 10. 파일 업로드 규칙

**이미지/증명서 업로드**

```
Content-Type: multipart/form-data
Authorization: Bearer {accessToken}  ← 동일하게 포함
```

```
FormData {
  imgTypeCd: string   // 이미지 유형 코드
  file: File          // 업로드 파일
}
```

**엑셀/PDF 다운로드**

- `responseType: 'blob'` 으로 수신
- 응답 헤더의 `Content-Disposition`에서 파일명 추출

---

## 11. 에러 코드 처리 기준

| HTTP Status | 처리 방식                                                                    |
| ----------- | ---------------------------------------------------------------------------- |
| 200         | 정상                                                                         |
| 400         | 요청 오류 (validation 실패, 비즈니스 룰 위반) — 화면에서 에러 메시지 표시    |
| 401         | 미인증 → 로그인 페이지 이동 (단, 로그인 API 자체의 401은 에러 메시지만 표시) |
| 403         | 권한 없음 또는 AT 만료 → refresh 시도 → 실패 시 로그아웃 처리                |
| 404         | 리소스 없음                                                                  |
| 409         | 충돌 (중복 등록, version 충돌)                                               |

**에러 응답 구조**

```json
{
  "success": false,
  "message": "에러 메시지",
  "httpStatus": 400,
  "code": "ERROR_CODE"
}
```

---

## 부록. 주요 공통코드 그룹

| groupCode | 설명      |
| --------- | --------- |
| CD00006   | 성별 코드 |
| CD00007   | 등급 코드 |
| CD00008   | 품종 코드 |

> 실제 그룹코드 목록은 DB `TB_COMN_CODE_GROUP_MASTER` 기준으로 확인 필요
