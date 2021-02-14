import {StatementInfo} from './StatementInfo'
import {ParsedTransaction} from './ParsedTransaction'

export interface ParsedStatement {

  info: StatementInfo
  transactions: ParsedTransaction[]

}
