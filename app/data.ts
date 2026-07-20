/* ============================================================
   Lumo 한우 경매 — 목 데이터 · 타입 · 코드 라벨 · 포맷 헬퍼
   (딜러용 경매 백오피스 / 반응형)
   ============================================================ */
import type {BsBadgeTone} from '../components/common'

/* ---------- 네비게이션 ---------- */
export interface NavChildItem {
  key: string
  label: string
  to: string
}
export interface NavItem {
  key: string
  label: string
  icon: string
  to?: string
  badge?: string
  children?: NavChildItem[]
}

export const NAV: NavItem[] = [
  {key: 'dashboard', label: '대시보드', icon: 'grid', to: '/dashboard'},
  {
    key: 'auctions',
    label: '경매',
    icon: 'gavel',
    children: [
      {key: 'auctions-cattle', label: '소', to: '/auctions'},
      {key: 'auctions-parts', label: '부위', to: '/auctions/parts'},
      {key: 'auctions-live', label: '실시간현황', to: '/auctions/live'}
    ]
  },
  {key: 'bids', label: '경락내역', icon: 'receipt', to: '/bids'},
  {key: 'favorites', label: '즐겨찾기', icon: 'heart', to: '/favorites', badge: '4'},
  {key: 'notices', label: '공지사항', icon: 'megaphone', to: '/notices'},
  {key: 'balance', label: '자산', icon: 'wallet', to: '/balance'},
  {key: 'settings', label: '설정', icon: 'cog', to: '/settings'}
]

/* ---------- 코드 라벨 매핑 ---------- */
export const GENDER_LABEL: Record<string, string> = {
  STEER: '거세',
  COW: '암소',
  BULL: '수소',
  HEIFER: '미경산'
}
export const BREED_LABEL: Record<string, string> = {
  HANWOO: '한우',
  DAIRY: '육우',
  CROSS: '교잡'
}
export const NOTICE_TYPE_LABEL: Record<string, string> = {
  GENERAL: '일반',
  SYSTEM: '시스템',
  EVENT: '이벤트'
}
/** 육질등급(1+/1/2/3) → 배지 톤 */
export function gradeTone(grade: string): BsBadgeTone {
  if (grade === '1++' || grade === '1+') return 'brand'
  if (grade === '1') return 'success'
  if (grade === '2') return 'info'
  return 'neutral'
}

/* ---------- 포맷 헬퍼 ---------- */
export const formatNumber = (n: number): string => n.toLocaleString('ko-KR')
export const formatWon = (n: number): string => `₩ ${n.toLocaleString('ko-KR')}`
export const formatWonSigned = (n: number): string => `${n < 0 ? '-' : '+'}₩ ${Math.abs(n).toLocaleString('ko-KR')}`
export function formatDate(iso: string, withTime = false): string {
  const d = new Date(iso)
  const base = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  if (!withTime) return base
  return `${base} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/* ============================================================
   경락 내역 (대시보드)
   ============================================================ */
export interface BidRow {
  companyNm: string
  genderCd: string
  partNm: string
  bidSeq: number
  receiptNo: string
  gradeCd: string
  weight: number
  bidPrice: number
}

export const BIDS: BidRow[] = [
  {
    companyNm: '한우상장업체',
    genderCd: 'STEER',
    partNm: '등심',
    bidSeq: 1001,
    receiptNo: '260601-001-001',
    gradeCd: '1+',
    weight: 12.5,
    bidPrice: 85000
  },
  {
    companyNm: '한우상장업체',
    genderCd: 'COW',
    partNm: '안심',
    bidSeq: 1002,
    receiptNo: '260601-001-002',
    gradeCd: '1',
    weight: 8.3,
    bidPrice: 72000
  },
  {
    companyNm: '대한축산업체',
    genderCd: 'STEER',
    partNm: '채끝',
    bidSeq: 1003,
    receiptNo: '260601-002-001',
    gradeCd: '2',
    weight: 10.1,
    bidPrice: 60000
  }
]

/* ============================================================
   필터 옵션 / 소 목록 (경매)
   ============================================================ */
export interface SelectOpt {
  label: string
  value: string
}

export const FILTER_OPTIONS: {grades: SelectOpt[]; companies: SelectOpt[]} = {
  grades: [
    {label: '전체 등급', value: ''},
    {label: '1+', value: '1P'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'}
  ],
  companies: [
    {label: '전체 업체', value: ''},
    {label: '한우상장업체', value: '001'},
    {label: '대한축산업체', value: '002'}
  ]
}

export interface CattleRow {
  receiptNo: string
  breedCd: string
  genderCd: string
  gradeCd: string
  marblingGrade: string
  monthAge: number
  carcassWt: number
  companyNo: string
  companyNm: string
  partCount: number
  favorite: boolean
  interestSeq?: number
}

export const CATTLE_LIST: CattleRow[] = [
  {
    receiptNo: '260601-001-001',
    breedCd: 'HANWOO',
    genderCd: 'STEER',
    gradeCd: '1+',
    marblingGrade: 'BMS9',
    monthAge: 30,
    carcassWt: 420.5,
    companyNo: '001',
    companyNm: '한우상장업체',
    partCount: 5,
    favorite: false
  },
  {
    receiptNo: '260601-001-002',
    breedCd: 'HANWOO',
    genderCd: 'COW',
    gradeCd: '1',
    marblingGrade: 'BMS7',
    monthAge: 28,
    carcassWt: 380.0,
    companyNo: '001',
    companyNm: '한우상장업체',
    partCount: 4,
    favorite: true,
    interestSeq: 10
  },
  {
    receiptNo: '260601-002-001',
    breedCd: 'HANWOO',
    genderCd: 'STEER',
    gradeCd: '2',
    marblingGrade: 'BMS5',
    monthAge: 32,
    carcassWt: 450.0,
    companyNo: '002',
    companyNm: '대한축산업체',
    partCount: 6,
    favorite: false
  },
  {
    receiptNo: '260601-002-002',
    breedCd: 'HANWOO',
    genderCd: 'STEER',
    gradeCd: '1+',
    marblingGrade: 'BMS9',
    monthAge: 29,
    carcassWt: 410.2,
    companyNo: '002',
    companyNm: '대한축산업체',
    partCount: 3,
    favorite: false
  }
]

/* ============================================================
   즐겨찾기
   ============================================================ */
export interface FavoriteCattle {
  interestSeq: number
  receiptNo: string
  gradeCd: string
  companyNm: string
}
export interface FavoritePart {
  interestSeq: number
  listingNo: string
  partCd: string
  partNm: string
  gradeCd: string
  companyNm: string
  weight: number
  minPrice: number
}

export const FAVORITES_CATTLE: FavoriteCattle[] = [
  {interestSeq: 10, receiptNo: '260601-001-002', gradeCd: '1', companyNm: '한우상장업체'},
  {interestSeq: 11, receiptNo: '260601-002-001', gradeCd: '2', companyNm: '대한축산업체'}
]
export const FAVORITES_PART: FavoritePart[] = [
  {
    interestSeq: 20,
    listingNo: 'L-001',
    partCd: 'LOIN',
    partNm: '등심',
    gradeCd: '1+',
    companyNm: '한우상장업체',
    weight: 12.5,
    minPrice: 80000
  },
  {
    interestSeq: 21,
    listingNo: 'L-002',
    partCd: 'TEND',
    partNm: '안심',
    gradeCd: '1',
    companyNm: '대한축산업체',
    weight: 8.0,
    minPrice: 70000
  }
]

/* ============================================================
   공지사항
   ============================================================ */
export interface Notice {
  ntceNo: number
  title: string
  regDt: string
  pinYn: 'Y' | 'N'
}
export interface NoticeDetail extends Notice {
  content: string
  calendarYm: string
  ntceTargetType: string
  ntceType: string
  publishYn: string
  modDt: string
  regId: string
  regNm: string
}

export const NOTICES: Notice[] = [
  {ntceNo: 1, title: '2026년 7월 경매 일정 안내', regDt: '2026-06-25T09:00:00', pinYn: 'Y'},
  {ntceNo: 2, title: '시스템 점검 안내 (6/30)', regDt: '2026-06-20T10:00:00', pinYn: 'N'},
  {ntceNo: 3, title: '여름철 축산물 위생 관리 공지', regDt: '2026-06-15T11:00:00', pinYn: 'N'}
]

export const NOTICE_DETAILS: Record<number, NoticeDetail> = {
  1: {
    ntceNo: 1,
    title: '2026년 7월 경매 일정 안내',
    content:
      '안녕하세요.\n7월 경매 일정을 안내드립니다.\n\n- 7월 1일(화) 오전 9시\n- 7월 8일(화) 오전 9시\n- 7월 15일(화) 오전 9시\n\n많은 참여 바랍니다.',
    calendarYm: '2026-07',
    ntceTargetType: 'ALL',
    ntceType: 'GENERAL',
    pinYn: 'Y',
    publishYn: 'Y',
    regDt: '2026-06-25T09:00:00',
    modDt: '2026-06-25T09:00:00',
    regId: 'admin',
    regNm: '관리자'
  },
  2: {
    ntceNo: 2,
    title: '시스템 점검 안내 (6/30)',
    content: '6월 30일(월) 오전 2시~4시 시스템 점검이 있을 예정입니다.\n\n해당 시간 동안 서비스 이용이 불가합니다.',
    calendarYm: '2026-06',
    ntceTargetType: 'ALL',
    ntceType: 'SYSTEM',
    pinYn: 'N',
    publishYn: 'Y',
    regDt: '2026-06-20T10:00:00',
    modDt: '2026-06-20T10:00:00',
    regId: 'admin',
    regNm: '관리자'
  },
  3: {
    ntceNo: 3,
    title: '여름철 축산물 위생 관리 공지',
    content: '여름철 고온다습한 환경에서 축산물 위생 관리에 각별히 유의하시기 바랍니다.',
    calendarYm: '2026-06',
    ntceTargetType: 'ALL',
    ntceType: 'GENERAL',
    pinYn: 'N',
    publishYn: 'Y',
    regDt: '2026-06-15T11:00:00',
    modDt: '2026-06-15T11:00:00',
    regId: 'admin',
    regNm: '관리자'
  }
}

/* ============================================================
   자산 (잔고 / 거래내역)
   ============================================================ */
export interface Balance {
  balance: number
  dealerNo: string
  updateDt: string
}
export interface Transaction {
  typeCd: number // 1: 입금, 2: 출금
  amount: number
  description: string
  regDt: string
}

export const BALANCE: Balance = {balance: 5280000, dealerNo: '003', updateDt: '2026-06-29T08:30:00'}
export const TRANSACTIONS: Transaction[] = [
  {typeCd: 1, amount: 1200000, description: '낙찰 대금', regDt: '2026-06-25T14:00:00'},
  {typeCd: 2, amount: -300000, description: '출금', regDt: '2026-06-24T11:00:00'},
  {typeCd: 1, amount: 850000, description: '낙찰 대금', regDt: '2026-06-20T16:00:00'}
]
