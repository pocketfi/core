import {ITransaction} from '../../types/interfaces/ITransaction'
import {StatementInfo} from './StatementInfo'

export interface ParsedStatement {

  info: StatementInfo
  transactions: ITransaction[]

}
