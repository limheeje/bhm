import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: {
      staffContactNo: '010-1111-1111',
      staffNm: '관리자',
      userType: 'ADMIN',
      orgNm: '중앙도매시장',
      orgNo: '001',
      roleCd: 'MASTER_ADMIN',
      lastLoginDt: '2026-06-29T09:00:00',
      lastLoginIp: '127.0.0.1'
    }
  }
})
