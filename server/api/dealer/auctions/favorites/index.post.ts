import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return {
    success: true,
    message: '',
    httpStatus: 200,
    data: { interestSeq: Math.floor(Math.random() * 1000) + 100 }
  }
})
