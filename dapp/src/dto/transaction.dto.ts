export interface PostTransactionDto {
    idkey: string
    amount: number
    currency_type: string
  }
export interface PostTransactionDbDto {
    idkey: string
    hash: string
    amount: number
    currency_type: string
    created_at: Date
  }
export interface CreateCCTransactionDto {
    id: string
    idkey: string
    hash: string
    amount: string
    currency_type: string
    created_at: string
  }
