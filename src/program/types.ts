import {SourceLocation, Node} from 'estree'
import ProgramState from './ProgramState'

export interface Step {
  codeLocation:    SourceLocation | null
  startState:      ProgramState
  endState:        ProgramState
  actionPerformed: boolean
}

export interface ProgramScoring {
  score:   number
  message: string | null
}

export type Recordable<N extends Node> = N & {
  recordable?: boolean,
}
export type RecordableNode = Recordable<Node>

export interface CodeError extends Error {
  node: Node | null
  loc:  SourceLocation
}

