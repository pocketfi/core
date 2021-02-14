import {ParsedStatement} from './ParsedStatement'
import {ParserInfo} from './ParserInfo'

export interface Parser {

  info: ParserInfo

  parse(data: Buffer): ParsedStatement

}
