import {Parser} from '../../../types/Parser'
import {ParserInfo} from '../../../types/ParserInfo'
import {ParsedStatement} from '../../../types/ParsedStatement'
import {find} from '../banks'
import {RegisterParser} from '../../../decorators/RegisterParser'
import iconv from 'iconv-lite'
import parse from 'csv-parse/lib/sync'
import {TransactionType} from '../../../../types/enums/TransactionType'
import {ParsedTransaction} from '../../../types/ParsedTransaction'
import moment from 'moment'


@RegisterParser
export class PriorbankParser implements Parser {

  constructor() {
  }

  info: ParserInfo = {
    bank: find('PRIORBANK'),
    format: 'csv'
  }

  /**
   * TODO: separate blocked amounts since they use different column structure
   */
  parse(data: Buffer): ParsedStatement {
    const content: string = iconv.decode(data, 'cp1251')
    const matches = content.match(new RegExp('^\\d{2}.\\d{2}.\\d{4} \\d{2}:\\d{2}:\\d{2}.*$', 'gm'))
    const csv = parse(matches.join('\n'), {relax: true, delimiter: ';', relax_column_count: true})

    return {
      info: {
        issuer: this.info.bank,
        format: this.info.format,
        formatDetails: {
          headerRow: false,
          delimiter: ';'
        }
      },
      transactions: csv.map(r => this.parseRow(r))
    }
  }

  parseRow(columns: string[]): ParsedTransaction {
    const transactionDate = this.formatDate(columns[0])
    const place = columns[1]
    const price = Number(columns[2].replace(',', '.'))
    const currency = columns[3]
    const category = columns[7]
    const transactionType = price > 0 ? TransactionType.INCOME : TransactionType.EXPENSE

    return {
      transactionType,
      transactionDate,
      place,
      price: Math.abs(price),
      currency,
      category,
    }
  }

  formatDate(date: string): Date {
    return moment(date, 'DD.MM.YYYY HH:mm:ss').toDate()
  }

}
