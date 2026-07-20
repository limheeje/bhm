import type {UserType} from '~/constants/userType'
import type {SingleResponse} from '~/types/commonResponse'

export interface LoginMeResponse {
  staffContactNo: string // 로그인 ID로도 쓰이는 연락처 (예: "010-1234-5678")
  staffNm: string // 이름 (설정 페이지의 "이름" input과 매칭)
  email: string // 이메일 (설정 페이지의 "이메일" input과 매칭)
  profileImgUrl: string | null // 프로필 사진 URL. 아직 업로드 안 했으면 null → 이 경우 BsAvatar가 이니셜로 대체 표시
  userType: UserType // 포털 구분값: 'ADMIN' | 'COMPANY' | 'DEALER' (constants/userType.ts 참고)
  orgNm: string // 소속 기관/업체명 (예: "중앙도매시장")
  orgNo: string // 소속 기관/업체 코드
  roleCd: string // 권한 코드 (예: "MASTER_ADMIN") — 관리자 CRUD API에서 쓰던 것과 동일한 값
  lastLoginDt: string // 마지막 로그인 일시 (ISO 문자열, 예: "2026-06-29T09:00:00")
  lastLoginIp: string // 마지막 로그인 IP
}
export interface PutAuthMeParams {
  staffNm?: string
  email?: string
  file?: File
}
export interface PostAuthMeAvatarParams {
  file: File
}
export interface PostAuthMeAvatarResponse {
  profileImgUrl: string
}

const BASE_URL = `/auth/me`
const BASE_URL_AVATAR = `${BASE_URL}/avatar`
export const useAuthMe = () => {
  const getAuthMe = async (): Promise<SingleResponse<LoginMeResponse> | null> => {
    try {
      return await useClientFetch.get(BASE_URL)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  const putAuthMe = async (params: PutAuthMeParams): Promise<SingleResponse<LoginMeResponse> | null> => {
    try {
      const formData = new FormData()
      if (params.staffNm) formData.append('staffNm', params.staffNm)
      if (params.email) formData.append('email', params.email)
      if (params.file) formData.append('file', params.file)
      return await useClientFetch.put(BASE_URL, formData)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  const postAuthMeAvatar = async (
    params: PostAuthMeAvatarParams
  ): Promise<SingleResponse<PostAuthMeAvatarResponse> | null> => {
    try {
      const formData = new FormData()
      formData.append('file', params.file)
      return await useClientFetch.post(BASE_URL_AVATAR, formData)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getAuthMe,
    putAuthMe,
    postAuthMeAvatar
  }
}
