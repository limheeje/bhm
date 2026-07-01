import {defineStore} from 'pinia'
import type {LoginResponse} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    accessToken: '',
    refreshToken: '',
    managerId: '',
    managerName: '',
    userType: '',
    orgNm: '',
    orgNo: '',
    roleCd: '',
    expiresIn: 1800
  }),
  actions: {
    setLogin(data: LoginResponse) {
      if (data) {
        this.isLoggedIn = true
        this.accessToken = data.accessToken
        this.refreshToken = data.refreshToken
        this.managerId = data.managerId
        this.managerName = data.managerName
        this.userType = data.userType
        this.orgNm = data.orgNm
        this.orgNo = data.orgNo
        this.roleCd = data.roleCd
        this.expiresIn = data.expiresIn
      }
    },
    setLogout() {
      this.isLoggedIn = false
      this.accessToken = ''
      this.refreshToken = ''
      this.managerId = ''
      this.managerName = ''
      this.userType = ''
      this.orgNm = ''
      this.orgNo = ''
      this.roleCd = ''
      this.expiresIn = 0
      if (import.meta.client) {
        removeCookie('accessToken')
        removeCookie('refreshToken')
      }
    }
  },
  // persist: true → 새로고침해도 store 상태 유지 (pinia-plugin-persistedstate 필요)
  persist: true
})
