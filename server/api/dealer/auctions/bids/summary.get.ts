import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const totalCount = MOCK_BIDS.length
  const totalAmount = MOCK_BIDS.reduce((sum, b) => sum + b.bidPrice, 0)
  const totalWeight = Number(MOCK_BIDS.reduce((sum, b) => sum + b.weight, 0).toFixed(1))
  const avgPrice = totalCount ? Math.round(totalAmount / totalCount) : 0

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: {
      totalCount,
      totalAmount,
      totalWeight,
      avgPrice
    }
  }
})
