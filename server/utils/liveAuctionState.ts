import type {Peer} from 'crossws'

// ─── 실시간 경매 현황 (mock) ────────────────────────────────────────────────
// 관리자 포털이 없는 프로젝트라, 회차 시작/종료 관리는 생략하고
// "항상 하나의 회차가 진행 중"이라고 가정한 축소 버전.
export interface LiveLot {
  lotId: string
  receiptNo: string
  partNm: string
  gradeCd: string
  companyNm: string
  startPrice: number
  currentPrice: number
  bidCount: number
  status: 'ACTIVE' | 'END'
  highestBidderLabel: string | null
}

const OTHER_DEALER_LABELS = ['003번 중도매인', '007번 중도매인', '012번 중도매인', '021번 중도매인']

// 부위 mock 데이터를 순환하면서 계속 새 경매 항목을 뽑아내기 위한 커서
let poolIndex = 0
function nextPart() {
  const part = MOCK_PART_LISTINGS[poolIndex % MOCK_PART_LISTINGS.length]
  poolIndex++
  if (!part) throw new Error('MOCK_PART_LISTINGS is empty')
  return part
}

function lotFromPart(part: (typeof MOCK_PART_LISTINGS)[number]): LiveLot {
  return {
    // 같은 부위가 나중에 다시 뽑혀도 lotId가 겹치지 않도록 시간값을 붙임
    lotId: `LIVE-${part.listingNo}-${Date.now()}`,
    receiptNo: part.receiptNo,
    partNm: part.partNm,
    gradeCd: part.gradeCd,
    companyNm: part.companyNm,
    startPrice: part.minPrice,
    currentPrice: part.minPrice,
    bidCount: 0,
    status: 'ACTIVE',
    highestBidderLabel: null
  }
}

function buildInitialLots(): LiveLot[] {
  return Array.from({length: 5}, () => lotFromPart(nextPart()))
}

const lots: LiveLot[] = buildInitialLots()
const peers = new Set<Peer>()

function broadcast(message: object) {
  const text = JSON.stringify(message)
  for (const peer of peers) {
    try {
      peer.send(text)
    } catch (err) {
      console.log(err)
    }
  }
}

export function getLots(): LiveLot[] {
  return lots
}

export function registerPeer(peer: Peer) {
  peers.add(peer)
  peer.send(JSON.stringify({type: 'INIT', payload: {lots}}))
}

export function unregisterPeer(peer: Peer) {
  peers.delete(peer)
}

export function placeBid(lotId: string, price: number, bidderLabel: string) {
  const lot = lots.find((l) => l.lotId === lotId)
  if (!lot) {
    return {success: false, message: '존재하지 않는 경매 항목입니다.'}
  }
  if (lot.status !== 'ACTIVE') {
    return {success: false, message: '이미 종료된 항목입니다.'}
  }
  if (typeof price !== 'number' || price <= lot.currentPrice) {
    return {success: false, message: '현재가보다 높은 금액을 입력해주세요.'}
  }

  lot.currentPrice = price
  lot.bidCount++
  lot.highestBidderLabel = bidderLabel

  broadcast({type: 'BID_UPDATE', payload: lot})
  return {success: true}
}

// ─── 시뮬레이션: 다른 중도매인들이 실시간으로 입찰하는 것처럼 흉내 ────────────
let started = false
export function startLiveAuctionSimulation() {
  if (started) return
  started = true

  // 1.8초마다 무작위 항목에 다른 중도매인의 입찰이 들어오는 것처럼 갱신
  setInterval(() => {
    const activeLots = lots.filter((l) => l.status === 'ACTIVE')
    const lot = activeLots[Math.floor(Math.random() * activeLots.length)]
    if (!lot) return
    const bump = 1000 + Math.floor(Math.random() * 4) * 1000
    const bidder = OTHER_DEALER_LABELS[Math.floor(Math.random() * OTHER_DEALER_LABELS.length)]
    if (!bidder) return
    lot.currentPrice += bump
    lot.bidCount++
    lot.highestBidderLabel = bidder
    broadcast({type: 'BID_UPDATE', payload: lot})
  }, 1800)

  // 15초마다 진행 중인 항목 하나를 마감 처리하고,
  // 2초 뒤 그 자리를 새 항목으로 채워서 계속 진행 중인 것이 남아있게 함
  setInterval(() => {
    const activeLots = lots.filter((l) => l.status === 'ACTIVE')
    const lot = activeLots[Math.floor(Math.random() * activeLots.length)]
    if (!lot) return
    lot.status = 'END'
    broadcast({type: 'LOT_CLOSED', payload: lot})

    setTimeout(() => {
      const newLot = lotFromPart(nextPart())
      const idx = lots.findIndex((l) => l.lotId === lot.lotId)
      if (idx === -1) {
        lots.push(newLot)
      } else {
        lots.splice(idx, 1, newLot)
      }
      broadcast({type: 'LOT_REPLACED', payload: {closedLotId: lot.lotId, newLot}})
    }, 2000)
  }, 15000)
}
