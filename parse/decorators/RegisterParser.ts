import {Parser} from '../types/Parser'

const parserMap: Map<string, Parser> = new Map<string, Parser>()

export const RegisterParser = (constructor: Function) => {
  // @ts-ignore
  parserMap.set(constructor.name, new constructor())
}

export const getParser = (name: string): Parser => parserMap.get(name)
