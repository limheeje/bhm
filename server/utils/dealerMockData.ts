// ─── 경락 내역 (dashboard) ────────────────────────────────────────────────────
export const MOCK_BIDS = [
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
export const MOCK_CATTLE_LIST = [
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

// ─── 공지사항 (notice) ────────────────────────────────────────────────────────
export const MOCK_NOTICES = [
  {ntceNo: 1, title: '2026년 7월 경매 일정 안내', regDt: '2026-06-25T09:00:00', pinYn: 'Y'},
  {ntceNo: 2, title: '시스템 점검 안내 (6/30)', regDt: '2026-06-20T10:00:00', pinYn: 'N'},
  {ntceNo: 3, title: '여름철 축산물 위생 관리 공지', regDt: '2026-06-15T11:00:00', pinYn: 'N'}
]

export const MOCK_NOTICE_DETAILS: Record<number, object> = {
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

// ─── 소 상세 (auctions/[receiptNo]) ──────────────────────────────────────────
export const MOCK_CATTLE_DETAILS: Record<string, object> = {
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

// ─── 자산 (balance) ───────────────────────────────────────────────────────────
export const MOCK_BALANCE = {
  balance: 5280000,
  dealerNo: '003',
  updateDt: '2026-06-29T08:30:00'
}
export const MOCK_TRANSACTIONS = [
  {typeCd: 1, amount: 1200000, description: '낙찰 대금', regDt: '2026-06-25T14:00:00'},
  {typeCd: 2, amount: -300000, description: '출금', regDt: '2026-06-24T11:00:00'},
  {typeCd: 1, amount: 850000, description: '낙찰 대금', regDt: '2026-06-20T16:00:00'}
]
