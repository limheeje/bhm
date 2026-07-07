export interface CommonResponse {
  success: boolean
  message: string
  httpStatus: number
}

export interface SingleResponse<T> extends CommonResponse {
  data: T
}

export interface ListResponse<T> extends CommonResponse {
  data: T[]
}
export interface PaginationPageInfoResponese {
  totalPages: number
  totalElements: number
  pageNumber: number
  pageSize: number
  offset: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  size: 10
  number: number
}
export interface PaginationResponse<T> extends CommonResponse {
  data: T[]
  pageInfo: PaginationPageInfoResponese
}
