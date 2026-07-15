// ─── 경락 내역 (dashboard) ────────────────────────────────────────────────────
const BID_COMPANIES = ['한우상장업체', '대한축산업체']
const BID_GENDERS = ['STEER', 'COW']
const BID_PARTS = ['등심', '안심', '채끝', '우둔', '앞다리', '사태']
const BID_GRADES = ['1+', '1', '2', '3']

// 낙찰일시 mock — 오늘 기준으로 과거로 offsetHours시간 전 'YYYY-MM-DD HH:mm' 문자열 생성
function mockBidDt(offsetHours: number): string {
  const d = new Date(Date.now() - offsetHours * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function generateMockBids(count: number) {
  const fixed = [
    {
      companyNm: '한우상장업체',
      genderCd: 'STEER',
      partNm: '등심',
      bidSeq: 1001,
      receiptNo: '260601-001-001',
      gradeCd: '1+',
      weight: 12.5,
      bidPrice: 85000,
      bidDt: mockBidDt(3),
      unsoldYn: 'N'
    },
    {
      companyNm: '한우상장업체',
      genderCd: 'COW',
      partNm: '안심',
      bidSeq: 1002,
      receiptNo: '260601-001-002',
      gradeCd: '1',
      weight: 8.3,
      bidPrice: 72000,
      bidDt: mockBidDt(5),
      unsoldYn: 'N'
    },
    {
      companyNm: '대한축산업체',
      genderCd: 'STEER',
      partNm: '채끝',
      bidSeq: 1003,
      receiptNo: '260601-002-001',
      gradeCd: '2',
      weight: 10.1,
      bidPrice: 60000,
      bidDt: mockBidDt(8),
      unsoldYn: 'N'
    }
  ]

  const generated = []
  for (let i = 0; i < count - fixed.length; i++) {
    const bidSeq = 1004 + i
    const companyNm = BID_COMPANIES[i % BID_COMPANIES.length]
    const genderCd = BID_GENDERS[i % BID_GENDERS.length]
    const partNm = BID_PARTS[i % BID_PARTS.length]
    const gradeCd = BID_GRADES[i % BID_GRADES.length]
    const weight = Number((6 + ((i * 37) % 90) / 10).toFixed(1))
    const unsoldYn = i % 4 === 0 ? 'Y' : 'N'
    const bidPrice = unsoldYn === 'Y' ? 0 : 40000 + ((i * 6173) % 55000)
    const lotNo = String(Math.floor(i / 4) + 3).padStart(3, '0')
    const receiptNo = `260601-${lotNo}-${String((i % 4) + 1).padStart(3, '0')}`
    const bidDt = mockBidDt(10 + i * 8)
    generated.push({companyNm, genderCd, partNm, bidSeq, receiptNo, gradeCd, weight, bidPrice, bidDt, unsoldYn})
  }
  return [...fixed, ...generated]
}

// 대시보드 KPI/경락내역 페이지네이션·기간필터 테스트용 150건 (최근 약 7주에 걸쳐 분포)
export const MOCK_BIDS = generateMockBids(150)

// ─── 필터 옵션 (auctions/index) ───────────────────────────────────────────────
export const MOCK_FILTER_OPTIONS = {
  grades: [
    {label: '전체', value: ''},
    {label: '1+', value: '1P'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'}
  ],
  companies: [
    {label: '전체', value: ''},
    {label: '한우상장업체', value: '001'},
    {label: '대한축산업체', value: '002'}
  ]
}

// ─── 소 목록 (auctions/index) ─────────────────────────────────────────────────
const CATTLE_GRADES = ['1+', '1', '2', '3']
const CATTLE_MARBLING: Record<string, string> = {'1+': 'BMS9', '1': 'BMS7', '2': 'BMS5', '3': 'BMS3'}
const CATTLE_COMPANIES = [
  {companyNo: '001', companyNm: '한우상장업체'},
  {companyNo: '002', companyNm: '대한축산업체'}
]
const CATTLE_GENDERS = ['STEER', 'COW']

function generateMockCattleList(count: number) {
  const fixed = [
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

  const generated = []
  for (let i = 0; i < count - fixed.length; i++) {
    const gradeCd = CATTLE_GRADES[i % CATTLE_GRADES.length]
    const gender = CATTLE_GENDERS[i % CATTLE_GENDERS.length]
    const company = CATTLE_COMPANIES[i % CATTLE_COMPANIES.length]
    const lotNo = String(Math.floor(i / 4) + 3).padStart(3, '0')
    const seq = String((i % 4) + 1).padStart(3, '0')
    generated.push({
      receiptNo: `260601-${lotNo}-${seq}`,
      breedCd: 'HANWOO',
      genderCd: gender,
      gradeCd,
      marblingGrade: CATTLE_MARBLING[gradeCd],
      monthAge: 24 + ((i * 3) % 24),
      carcassWt: Number((350 + ((i * 17) % 150)).toFixed(1)),
      companyNo: company.companyNo,
      companyNm: company.companyNm,
      partCount: 3 + (i % 5),
      favorite: false
    })
  }
  return [...fixed, ...generated]
}

// 필터+페이지네이션 테스트용 150건
export const MOCK_CATTLE_LIST = generateMockCattleList(150)

// ─── 즐겨찾기 목록 (favorites/index) ─────────────────────────────────────────
export const MOCK_FAVORITES_CATTLE = [
  {interestSeq: 10, receiptNo: '260601-001-002', gradeCd: '1', companyNm: '한우상장업체'},
  {interestSeq: 11, receiptNo: '260601-002-001', gradeCd: '2', companyNm: '대한축산업체'}
]
export const MOCK_FAVORITES_PART = [
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

let nextFavoriteSeq =
  Math.max(...MOCK_FAVORITES_CATTLE.map((f) => f.interestSeq), ...MOCK_FAVORITES_PART.map((f) => f.interestSeq)) + 1

export function generateFavoriteSeq() {
  return nextFavoriteSeq++
}

// ─── 공지사항 (notice) ────────────────────────────────────────────────────────
const NOTICE_TITLE_TEMPLATES = [
  '{ym} 경매 일정 안내',
  '시스템 점검 안내',
  '축산물 위생 관리 공지',
  '휴장일 안내',
  '경매 수수료 변경 안내',
  '중도매인 등록 서류 제출 안내',
  '정산 지연 관련 공지',
  '설비 점검에 따른 임시 휴장',
  '개인정보처리방침 개정 안내',
  '모바일 앱 업데이트 안내'
]

function generateMockNotices(count: number) {
  const fixed = [
    {ntceNo: 1, title: '2026년 7월 경매 일정 안내', regDt: '2026-06-25T09:00:00', pinYn: 'Y'},
    {ntceNo: 2, title: '시스템 점검 안내 (6/30)', regDt: '2026-06-20T10:00:00', pinYn: 'N'},
    {ntceNo: 3, title: '여름철 축산물 위생 관리 공지', regDt: '2026-06-15T11:00:00', pinYn: 'N'}
  ]
  const baseDate = new Date('2026-06-14T09:00:00')
  const generated = []
  for (let i = 0; i < count - fixed.length; i++) {
    const ntceNo = fixed.length + i + 1
    const template = NOTICE_TITLE_TEMPLATES[i % NOTICE_TITLE_TEMPLATES.length]
    const ym = `${2026 - Math.floor(i / 12)}년 ${((11 - (i % 12)) % 12) + 1}월`
    const title = template.replace('{ym}', ym)
    const regDt = new Date(baseDate.getTime() - i * 26 * 60 * 60 * 1000).toISOString().slice(0, 19)
    generated.push({ntceNo, title, regDt, pinYn: i % 15 === 0 ? 'Y' : 'N'})
  }
  return [...fixed, ...generated]
}

// 목록 페이지네이션 테스트용 50건
export const MOCK_NOTICES = generateMockNotices(50)

function generateMockNoticeDetails(): Record<number, object> {
  const fixed: Record<number, object> = {
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

  // 4번~50번: 목록 데이터(MOCK_NOTICES)를 기반으로 상세 본문을 자동 생성
  const generated: Record<number, object> = {}
  for (const n of MOCK_NOTICES) {
    if (fixed[n.ntceNo]) continue
    const isSystem = n.title.includes('점검') || n.title.includes('휴장')
    generated[n.ntceNo] = {
      ntceNo: n.ntceNo,
      title: n.title,
      content: `${n.title}에 대해 안내드립니다.\n\n자세한 사항은 담당 부서로 문의해 주시기 바랍니다.\n\n감사합니다.`,
      calendarYm: n.regDt.slice(0, 7),
      ntceTargetType: 'ALL',
      ntceType: isSystem ? 'SYSTEM' : 'GENERAL',
      pinYn: n.pinYn,
      publishYn: 'Y',
      regDt: n.regDt,
      modDt: n.regDt,
      regId: 'admin',
      regNm: '관리자'
    }
  }

  return {...fixed, ...generated}
}

export const MOCK_NOTICE_DETAILS: Record<number, object> = generateMockNoticeDetails()

// ─── 소 상세 (auctions/[receiptNo]) ──────────────────────────────────────────
const CATTLE_PART_POOL = [
  {partCd: 'TEND', partNm: '안심'},
  {partCd: 'LOIN', partNm: '등심'},
  {partCd: 'STRI', partNm: '채끝'},
  {partCd: 'RNDS', partNm: '우둔'},
  {partCd: 'BLDE', partNm: '앞다리'},
  {partCd: 'SHRK', partNm: '사태'}
]

function generateMockCattleDetails(): Record<string, object> {
  const fixed = buildFixedCattleDetails()

  const generated: Record<string, object> = {}
  MOCK_CATTLE_LIST.forEach((c, i) => {
    if (fixed[c.receiptNo]) return
    const gradeBase = {'1+': 90000, '1': 78000, '2': 62000, '3': 48000}[c.gradeCd] ?? 60000
    const parts = Array.from({length: c.partCount}, (_, p) => {
      const part = CATTLE_PART_POOL[(i + p) % CATTLE_PART_POOL.length]
      const lotNo = c.receiptNo.split('-')[1]
      return {
        listingNo: `L-${lotNo}-${String(p + 1).padStart(3, '0')}`,
        partCd: part.partCd,
        partNm: part.partNm,
        weight: Number((c.carcassWt / c.partCount / 10).toFixed(1)),
        minPrice: gradeBase - p * 4000,
        listedYn: 'Y'
      }
    })
    generated[c.receiptNo] = {
      receiptNo: c.receiptNo,
      breedCd: c.breedCd,
      genderCd: c.genderCd,
      gradeCd: c.gradeCd,
      marblingGrade: c.marblingGrade,
      monthAge: c.monthAge,
      carcassWt: c.carcassWt,
      companyNo: c.companyNo,
      companyNm: c.companyNm,
      favorite: c.favorite,
      interestSeq: c.interestSeq ?? null,
      parts
    }
  })

  return {...fixed, ...generated}
}

function buildFixedCattleDetails(): Record<string, object> {
  return {
    '260601-001-001': {
      receiptNo: '260601-001-001',
      breedCd: 'HANWOO',
      genderCd: 'STEER',
      gradeCd: '1+',
      marblingGrade: 'BMS9',
      monthAge: 30,
      carcassWt: 420.5,
      companyNo: '001',
      companyNm: '한우상장업체',
      favorite: false,
      interestSeq: null,
      parts: [
        {listingNo: 'L-001-001', partCd: 'TEND', partNm: '안심', weight: 4.2, minPrice: 90000, listedYn: 'Y'},
        {listingNo: 'L-001-002', partCd: 'LOIN', partNm: '등심', weight: 12.5, minPrice: 80000, listedYn: 'Y'},
        {listingNo: 'L-001-003', partCd: 'STRI', partNm: '채끝', weight: 5.8, minPrice: 75000, listedYn: 'Y'},
        {listingNo: 'L-001-004', partCd: 'RNDS', partNm: '우둔', weight: 9.3, minPrice: 50000, listedYn: 'Y'},
        {listingNo: 'L-001-005', partCd: 'BLDE', partNm: '앞다리', weight: 11.2, minPrice: 45000, listedYn: 'Y'}
      ]
    },
    '260601-001-002': {
      receiptNo: '260601-001-002',
      breedCd: 'HANWOO',
      genderCd: 'COW',
      gradeCd: '1',
      marblingGrade: 'BMS7',
      monthAge: 28,
      carcassWt: 380.0,
      companyNo: '001',
      companyNm: '한우상장업체',
      favorite: true,
      interestSeq: 10,
      parts: [
        {listingNo: 'L-002-001', partCd: 'TEND', partNm: '안심', weight: 3.8, minPrice: 85000, listedYn: 'Y'},
        {listingNo: 'L-002-002', partCd: 'LOIN', partNm: '등심', weight: 11.0, minPrice: 72000, listedYn: 'Y'},
        {listingNo: 'L-002-003', partCd: 'RNDS', partNm: '우둔', weight: 8.5, minPrice: 48000, listedYn: 'Y'},
        {listingNo: 'L-002-004', partCd: 'BLDE', partNm: '앞다리', weight: 10.0, minPrice: 42000, listedYn: 'Y'}
      ]
    },
    '260601-002-001': {
      receiptNo: '260601-002-001',
      breedCd: 'HANWOO',
      genderCd: 'STEER',
      gradeCd: '2',
      marblingGrade: 'BMS5',
      monthAge: 32,
      carcassWt: 450.0,
      companyNo: '002',
      companyNm: '대한축산업체',
      favorite: false,
      interestSeq: null,
      parts: [
        {listingNo: 'L-003-001', partCd: 'TEND', partNm: '안심', weight: 4.5, minPrice: 70000, listedYn: 'Y'},
        {listingNo: 'L-003-002', partCd: 'LOIN', partNm: '등심', weight: 13.0, minPrice: 60000, listedYn: 'Y'},
        {listingNo: 'L-003-003', partCd: 'STRI', partNm: '채끝', weight: 6.0, minPrice: 58000, listedYn: 'Y'},
        {listingNo: 'L-003-004', partCd: 'RNDS', partNm: '우둔', weight: 10.0, minPrice: 40000, listedYn: 'Y'},
        {listingNo: 'L-003-005', partCd: 'BLDE', partNm: '앞다리', weight: 12.0, minPrice: 38000, listedYn: 'Y'},
        {listingNo: 'L-003-006', partCd: 'SHRK', partNm: '사태', weight: 7.5, minPrice: 35000, listedYn: 'Y'}
      ]
    },
    '260601-002-002': {
      receiptNo: '260601-002-002',
      breedCd: 'HANWOO',
      genderCd: 'STEER',
      gradeCd: '1+',
      marblingGrade: 'BMS9',
      monthAge: 29,
      carcassWt: 410.2,
      companyNo: '002',
      companyNm: '대한축산업체',
      favorite: false,
      interestSeq: null,
      parts: [
        {listingNo: 'L-004-001', partCd: 'TEND', partNm: '안심', weight: 4.0, minPrice: 92000, listedYn: 'Y'},
        {listingNo: 'L-004-002', partCd: 'LOIN', partNm: '등심', weight: 12.0, minPrice: 82000, listedYn: 'Y'},
        {listingNo: 'L-004-003', partCd: 'STRI', partNm: '채끝', weight: 5.5, minPrice: 77000, listedYn: 'Y'}
      ]
    }
  }
}

// 150건 전체 상세 (처음 4건은 손으로 쓴 값 유지, 나머지는 목록 데이터 기반 자동 생성)
export const MOCK_CATTLE_DETAILS: Record<string, object> = generateMockCattleDetails()

// ─── 부위 목록 (auctions/parts) — 모든 소의 부위를 한 목록으로 펼침 ──────────────
// 상세(MOCK_CATTLE_DETAILS[...].parts)와 같은 객체를 그대로 참조하게 해서,
// 찜 등록/해제가 어느 화면에서 일어나든 항상 같은 상태를 보게 함.
function generateMockPartListings() {
  const list: Record<string, any>[] = []
  for (const cattle of MOCK_CATTLE_LIST) {
    const detail = MOCK_CATTLE_DETAILS[cattle.receiptNo] as {parts?: Record<string, any>[]} | undefined
    for (const part of detail?.parts ?? []) {
      part.receiptNo = cattle.receiptNo
      part.gradeCd = cattle.gradeCd
      part.companyNo = cattle.companyNo
      part.companyNm = cattle.companyNm
      part.favorite = part.favorite ?? false
      list.push(part)
    }
  }
  return list
}

export const MOCK_PART_LISTINGS = generateMockPartListings()

// ─── 자산 (balance) ───────────────────────────────────────────────────────────
export const MOCK_BALANCE = {
  balance: 5280000,
  dealerNo: '003',
  updateDt: '2026-06-29T08:30:00'
}
const TRANSACTION_DESCRIPTIONS: Record<number, string[]> = {
  1: ['낙찰 대금', '정산 입금', '보증금 환급'],
  2: ['출금', '수수료 정산', '보증금 예치']
}

function generateMockTransactions(count: number) {
  const baseDate = new Date('2026-06-29T08:30:00')
  const list = []
  for (let i = 0; i < count; i++) {
    const isDeposit = i % 3 !== 0
    const typeCd = isDeposit ? 1 : 2
    const amount = isDeposit ? 300000 + ((i * 137) % 900000) : -(100000 + ((i * 91) % 400000))
    const description = TRANSACTION_DESCRIPTIONS[typeCd][i % TRANSACTION_DESCRIPTIONS[typeCd].length]
    const regDt = new Date(baseDate.getTime() - i * 6 * 60 * 60 * 1000).toISOString().slice(0, 19)
    list.push({typeCd, amount, description, regDt})
  }
  return list
}

// size=20 기준 12페이지 분량 (페이지네이션 테스트용)
export const MOCK_TRANSACTIONS = generateMockTransactions(240)
