import type {LoginRequest, LoginResponse} from '~/types/auth'
import type {SingleResponse} from '~/types/commonResponse'

export const BASE_URL = '/auth'
export const BASE_LOGIN_URL = `${BASE_URL}/login`
export const BASE_LOGOUT_URL = `${BASE_URL}/logout`

export const useLoginApi = {
  login: (params: LoginRequest) => useClientFetch.post<SingleResponse<LoginResponse>>(BASE_LOGIN_URL, params),
  logout: () => useClientFetch.post<SingleResponse<string>>(BASE_LOGOUT_URL, {})
}
