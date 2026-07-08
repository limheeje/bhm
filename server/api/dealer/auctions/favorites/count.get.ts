import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const cattleCount = MOCK_FAVORITES_CATTLE.length
  const partCount = MOCK_FAVORITES_PART.length

  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: {
      cattleCount,
      partCount,
      totalCount: cattleCount + partCount
    }
  }
})
