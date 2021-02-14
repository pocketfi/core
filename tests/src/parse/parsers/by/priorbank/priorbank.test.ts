import {PriorbankParser} from '../../../../../../parse/parsers/by/priorbank/PriorbankParser'
import {getBankResourcePath, loadFile} from '../../../../utils/file.util'
import {find} from '../../../../../../parse/parsers/by/banks'
import {TransactionType} from '../../../../../../types/enums/TransactionType'

describe('priorbank parser test', () => {

  const parser = new PriorbankParser()
  const resourcesPath = getBankResourcePath('by', 'priorbank')

  xit('should parse', () => {
    const data = loadFile(`${resourcesPath}/statement.csv`)
    const result = parser.parse(data)
    expect(result).toEqual({
      info: {
        issuer: find('PRIORBANK'),
        format: 'csv',
        formatDetails: {
          headerRow: false,
          delimiter: ';'
        }
      },
      transactions: [
        {
          transactionType: TransactionType.INCOME,
          transactionDate: parser.formatDate('06.01.2021 00:00:00'),
          place: 'Поступление на контракт клиента 000000-000000-000000  ',
          price: 180.2,
          currency: 'BYN',
          category: ''
        },
        {
          transactionType: TransactionType.EXPENSE,
          transactionDate: parser.formatDate('27.01.2021 00:00:00'),
          place: 'Retail BLR MINSK SHOP "EVROOPT"  ',
          price: 15.57,
          currency: 'BYN',
          category: ''
        },
        {
          transactionType: TransactionType.EXPENSE,
          transactionDate: parser.formatDate('13.02.2021 15:44:45'),
          place: 'Retail USA 425-9522985 Steam Purchase',
          price: 6.24,
          currency: 'USD',
          category: 'Цифровые товары'
        }
      ]
    })
  })

})
