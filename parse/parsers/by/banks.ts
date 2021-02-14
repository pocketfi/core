import {Bank} from '../../types/Bank'

export const banks: [Bank] = [
  {
    bankCode: 'PJCBBY2XXXX',
    countryCode: 'BY',
    name: 'PRIORBANK'
  }
]

export const find = (name: string): Bank => banks.find(b => b.name.toUpperCase() === name.toUpperCase())
