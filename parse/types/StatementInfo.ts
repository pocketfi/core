import {Bank} from './Bank'
import {FormatDetails} from './FormatDetails'

export interface StatementInfo {

  issuer: Bank
  format: string
  formatDetails: FormatDetails

}
