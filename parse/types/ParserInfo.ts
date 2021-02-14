import {Bank} from './Bank'
import {FormatDetails} from './FormatDetails'

export interface ParserInfo {

  bank: Bank
  format: string
  formatDetails?: FormatDetails

}
