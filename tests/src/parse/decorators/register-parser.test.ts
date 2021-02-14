import {getParser, RegisterParser} from '../../../../parse/decorators/RegisterParser'
import {Parser} from '../../../../parse/types/Parser'
import {ParsedStatement} from '../../../../parse/types/ParsedStatement'

describe('priorbank parser test', () => {

  @RegisterParser
  class TestParser implements Parser {
    info = null

    parse(data: Buffer): ParsedStatement {
      return {info: this.info, transactions: []}
    }
  }

  it('should register TestParser', () => {
    const parser = getParser(TestParser.name)
    expect(parser).toBeDefined()
  })

  it('should parse using TestParser', () => {
    const parser = getParser(TestParser.name)
    const result = parser.parse(null)
    expect(result).toEqual({info: null, transactions: []})
  })

})
