import Context from './Context'
import {Node, SourceLocation} from 'estree'

export type Variables = Record<string, any>

export interface RuntimeOptions {
  context?:   Context
  callbacks?: Callbacks
  source?:    string
}

export interface Callbacks {
  node?: (node: Node) => void
}

export type RuntimeErrorConstructor = new (message: string) => RuntimeError

export interface RuntimeError extends Error {
  node?: Node,
  loc?:  SourceLocation
}

export type TemplateTag = (quasis: string[], ...expressions: any[]) => any

export enum InterruptType {
  Return   = 'return',
  Break    = 'break',
  Continue = 'continue'
}
