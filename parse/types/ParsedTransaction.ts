import {TransactionType} from '../../types/enums/TransactionType'

export interface ParsedTransaction {

  transactionType: TransactionType
  transactionDate: Date
  place: string
  price: number
  currency: string
  category: string

}
