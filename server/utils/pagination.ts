export interface PageInfo {
  totalPages: number
  totalElements: number
  pageNumber: number
  pageSize: number
  offset: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  size: number
  number: number
}

export function paginate<T>(items: T[], page = 0, size = 10): {data: T[]; pageInfo: PageInfo} {
  const totalElements = items.length
  const totalPages = Math.max(Math.ceil(totalElements / size), 1)
  const pageNumber = Math.min(Math.max(page, 0), totalPages - 1)
  const offset = pageNumber * size
  const data = items.slice(offset, offset + size)

  return {
    data,
    pageInfo: {
      totalPages,
      totalElements,
      pageNumber,
      pageSize: size,
      offset,
      first: pageNumber === 0,
      last: pageNumber >= totalPages - 1,
      numberOfElements: data.length,
      empty: data.length === 0,
      size,
      number: pageNumber
    }
  }
}
