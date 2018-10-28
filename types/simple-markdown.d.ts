declare module 'simple-markdown' {

  import React from 'react'

  export interface ParseFunction {
    (source: string, state?: State): SyntaxTree
  }

  export interface OutputFunction<T> {
    (tree: SyntaxTree, state?: State): T
  }

  // Until https://github.com/Microsoft/TypeScript/issues/1863 is solved.
  export type State = any  

  export type SyntaxTree = Node[]

  export interface Node {
    type: string
  }

  export interface Rule<N extends Node> {
    order: number
    
    match: RuleMatchFunction
    parse: RuleParseFunction<N>

    react?: RuleOutputFunction<N, React.ReactNode>
    html?:  RuleOutputFunction<N, string>

    [key: string]: any
  }

  export interface RecurseParseFunction {
    (source: string, state: State): Node
  }

  export interface RuleMatchFunction {
    (source: string, state: State, lookbehind: string): RegExpExecArray | null
  }

  export interface RuleParseFunction<N extends Node> {
    (capture: string, parse: RecurseParseFunction, state: State): ParseResult<N>
  }

  export interface RuleOutputFunction<N extends Node, U> {
    (node: N, output: RecurseOutputFunction<U>, state: State): U
  }

  export interface RecurseOutputFunction<T> {
    (tree: SyntaxTree, state: State): T
  }

  export interface SingleNodeOutputFunction<N extends Node, U> {
    (node: N, state: State): U
  }

  export type ParseResult<N extends Node> = Omit<N, 'type'>
  
  export const defaultRules: {[key: string]: Rule<any>}

  export function defaultBlockParse(source: string): SyntaxTree
  export function defaultInlineParse(source: string): SyntaxTree
  export function defaultImplicitParse(source: string): SyntaxTree
  export function defaultOutput(tree: SyntaxTree): React.ReactNode

  export function parserFor(rules: {[key: string]: Rule<any>}): ParseFunction
  export function parse(source: string): SyntaxTree
  export function ruleOutput(rules: {[key: string]: Rule<any>}, key: string): SingleNodeOutputFunction<any, any>

  export function reactFor(singleNodeOutputFunction: SingleNodeOutputFunction<any, React.ReactNode>): OutputFunction<React.ReactNode>
  export function htmlFor(singleNodeOutputFunction: SingleNodeOutputFunction<any, string>): OutputFunction<string>

  export function inlineRegex(regex: RegExp): RuleMatchFunction
  export function blockRegex(regex: RegExp): RuleMatchFunction
  export function anyScopeRegex(regex: RegExp): RuleMatchFunction

}