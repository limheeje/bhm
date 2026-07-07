import type {TransactionsDataResponse} from '~/types/asset/transactions'

export type Transaction = TransactionsDataResponse

export interface TransactionListProps {
  items: Transaction[]
  /** Shows the skeleton instead of `items`. @default false */
  pending?: boolean
  /** Total page count, passed straight to `BsPagination`. @default 1 */
  totalPages?: number
  /** Number of placeholder rows to render while `pending`. @default 5 */
  skeletonRows?: number
}

export interface TransactionListEmits {
  (e: 'update:page', page: number): void
}
