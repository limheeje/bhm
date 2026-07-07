export interface GetBalance {
  balance: number
  dealerNo: string
  updateDt: string
}
export interface GetTransactions {
  typeCd?: number
  from?: string
  to?: string
  page?: number
  size?: number
}

export const BASE_URL = `/dealer`
export const BASE_ASSET_BALANCE = `${BASE_URL}/asset/balance`
export const BASE_ASSET_TRANSACTIONS = `${BASE_URL}/asset/transactions`

export const useAssetApi = () => {
  async function getBalance<T>(): Promise<T | null> {
    try {
      return await useClientFetch.get<T>(BASE_ASSET_BALANCE, {})
    } catch (err) {
      console.log(err)
      return null
    }
  }
  async function getTransactions<T>(params: GetTransactions): Promise<T | null> {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 1000))
      return await useClientFetch.get<T>(BASE_ASSET_TRANSACTIONS, params)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  return {
    getBalance,
    getTransactions
  }
}
