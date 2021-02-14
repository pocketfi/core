import * as fs from 'fs'

export const TEST_RESOURCES = 'tests/resources'

export const getBankResourcePath = (countryCode: string, name: string): string =>
  `${TEST_RESOURCES}/parse/parsers/${countryCode.toLowerCase()}/${name.toLowerCase()}`

export const loadFile = (path: string): Buffer => fs.readFileSync(path)

export const loadTextFile = (path: string, encoding?): string => loadFile(path).toString(encoding)
