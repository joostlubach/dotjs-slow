// tslint:disable camelcase no-useless-computed-key no-new-func no-any no-bitwise

import {Scope, Context, Function} from '.'
import * as nodes from 'estree'
import {isFunction} from 'lodash'
import {
  RuntimeOptions,
  Callbacks,
  InterruptType,
  Variables,
  TemplateTag,
  RuntimeErrorConstructor,
  RuntimeError
} from './types'

export default class Runtime {

  constructor(options: RuntimeOptions = {}) {
    this.context      = options.context || new Context()
    this.callbacks    = options.callbacks || {}
    this.currentScope = this.context
    this.source       = options.source || null
  }

  public readonly context:      Context
  public currentScope: Scope
  public readonly callbacks:    Callbacks
  public readonly source:       string | null

  public evaluate(node: nodes.Node) {
    this.runCallbacks(node)

    const {type} = node
    const evaluateFn = (this as any)[`evaluate_${type}`]

    if (evaluateFn == null) {
      const source = this.nodeSource(node)
      const desc = source == null ? 'This' : `\`${source.split(/\s/)[0]}\``
      this.throw(UnsupportedException, `${desc} is not supported`, node)
    } else {
      return evaluateFn.call(this, node)
    }
  }

  private runCallbacks(node: nodes.Node) {
    const {callbacks} = this
    if (callbacks == null) { return }

    if (callbacks.node) {
      callbacks.node(node)
    }
  }

  //------
  // Scopes

  public pushScope() {
    this.currentScope = new Scope(this.currentScope)
  }

  public popScope() {
    if (this.currentScope.parent == null) {
      throw new Error("Cannot pop root scope")
    }
    this.currentScope = this.currentScope.parent
  }

  public scoped(fn: (scope: Scope) => void) {
    this.pushScope()

    try {
      return fn(this.currentScope)
    } finally {
      this.popScope()
    }
  }

  //------
  // Program & statements

  private evaluate_Program(node: nodes.Program) {
    for (const bodyNode of hoist(node.body)) {
      this.evaluate(bodyNode)
    }
  }

  private evaluate_BlockStatement(node: nodes.BlockStatement) {
    this.currentScope.interruptType = null

    for (const bodyNode of hoist(node.body)) {
      this.evaluate(bodyNode)
      if (this.currentScope.interruptType != null) { break }
    }
  }

  private evaluate_EmptyStatement(node: nodes.EmptyStatement) {
    // Lalala
  }

  private evaluate_VariableDeclaration(node: nodes.VariableDeclaration) {
    const isConstant = node.kind === 'const'

    for (const declaration of node.declarations) {
      const {id, init} = declaration
      const initValue = init == null ? undefined : this.evaluate(init)
      this.declareVariable(id, initValue, isConstant, declaration)
    }
  }

  private evaluate_FunctionDeclaration(node: nodes.FunctionDeclaration) {
    this.createFunction(node, false)
  }

  private evaluate_IfStatement(node: nodes.IfStatement) {
    const {test, consequent, alternate} = node

    if (this.evaluate(test)) {
      this.evaluate(consequent)
    } else if (alternate != null) {
      this.evaluate(alternate)
    }
  }

  private evaluate_SwitchStatement(node: nodes.SwitchStatement) {
    const discriminant = this.evaluate(node.discriminant)

    const defaultIndex = node.cases.findIndex(cs => cs.test == null)

    let caseIndex = node.cases.findIndex(cs => {
      if (cs.test == null) { return false } // Default case
      return this.binary('===', discriminant, this.evaluate(cs.test), cs)
    })
    if (caseIndex === -1) {
      caseIndex = defaultIndex
    }
    if (caseIndex === -1) {
      return
    }

    for (let index = caseIndex; index < node.cases.length; index++) {
      const cs = node.cases[index]
      let broken = false

      for (const stmt of cs.consequent) {
        this.evaluate(stmt)
        if (this.currentScope.interruptType != null) {
          this.currentScope.interruptType = null
          broken = true
          break
        }
      }

      if (broken) { break }
    }
  }

  private evaluate_WhileStatement(node: nodes.WhileStatement) {
    const {test, body} = node

    while (this.evaluate(test)) {
      this.scoped(() => {
        this.evaluate(body)
      })
    }
  }

  private evaluate_ForStatement(node: nodes.ForStatement) {
    const {init, test, update, body} = node

    this.scoped(() => {
      if (init) {
        this.evaluate(init)
      }

      while (test == null || this.evaluate(test)) {
        this.scoped(() => {
          this.evaluate(body)
        })
        if (update) {
          this.evaluate(update)
        }

        if (this.currentScope.interruptType === 'break') {
          break
        }
      }
    })
  }

  private evaluate_ForInStatement(node: nodes.ForInStatement) {
    const iteratee = this.evaluate(node.right)
    const {kind, id: {name}} = (node.left as any).declarations[0]

    try {
      for (const key of Object.keys(iteratee)) {
        this.scoped(() => {
          try {
            this.currentScope.define(name, key, kind === 'const')
          } catch (error) {
            this.rethrow(error, node.left)
          }
          this.scoped(() => {
            this.evaluate(node.body)
          })
        })

        if (this.currentScope.interruptType === 'break') {
          break
        }
      }
    } catch (error) {
      this.rethrow(error, node)
    }
  }

  private evaluate_ForOfStatement(node: nodes.ForOfStatement) {
    const iteratee = this.evaluate(node.right)
    const {kind, id: {name}} = (node.left as any).declarations[0]

    try {
      for (const item of iteratee) {
        this.scoped(scope => {
          try {
            scope.define(name, item, kind === 'const')
          } catch (error) {
            this.rethrow(error, node.left)
          }
          this.scoped(() => {
            this.evaluate(node.body)
          })
        })

        if (this.currentScope.interruptType === InterruptType.Break) {
          break
        }
      }
    } catch (error) {
      this.rethrow(error, node)
    }
  }

  private evaluate_ReturnStatement(node: nodes.ReturnStatement) {
    this.currentScope.retval = node.argument == null ? null : this.evaluate(node.argument)
    this.currentScope.interruptType = InterruptType.Return
  }

  private evaluate_BreakStatement(node: nodes.BreakStatement) {
    this.currentScope.interruptType = InterruptType.Break
  }

  private evaluate_ContinueStatement(node: nodes.ContinueStatement) {
    this.currentScope.interruptType = InterruptType.Continue
  }

  private evaluate_ExpressionStatement(node: nodes.ExpressionStatement) {
    return this.evaluate(node.expression)
  }

  //------
  // Expressions

  private evaluate_AssignmentExpression(node: nodes.AssignmentExpression) {
    if (node.operator === '=') {
      // TODO: Allow patterns
      this.setValue((node.left as nodes.Identifier), this.evaluate(node.right))
    } else {
      const operator = node.operator.slice(0, node.operator.length - 1)

      let value = this.evaluate(node.left)
      value = this.binary(operator, value, this.evaluate(node.right), node)
      // TODO: Allow patterns
      this.setValue((node.left as nodes.Identifier), value)
    }
  }

  private evaluate_FunctionExpression(node: nodes.FunctionExpression) {
    return this.createFunction(node, false)
  }

  private evaluate_ArrowFunctionExpression(node: nodes.ArrowFunctionExpression) {
    return this.createFunction(node, true)
  }

  private evaluate_LogicalExpression(node: nodes.LogicalExpression) {
    const left = this.evaluate(node.left)
    if (!left && node.operator === '&&') { return left }
    if (left && node.operator === '||') { return left }

    const right = this.evaluate(node.right)
    return this.binary(node.operator, left, right, node)
  }

  private evaluate_UnaryExpression(node: nodes.UnaryExpression) {
    return this.unary(node.operator, this.evaluate(node.argument), node)
  }

  private evaluate_BinaryExpression(node: nodes.BinaryExpression) {
    return this.binary(node.operator, this.evaluate(node.left), this.evaluate(node.right), node)
  }

  private evaluate_UpdateExpression(node: nodes.UpdateExpression) {
    let argument = this.evaluate(node.argument)
    const argumentBefore = argument

    if (node.operator === '++') {
      argument += 1
      // TODO: Allow any expression.
      this.setValue(node.argument as nodes.Identifier, argument)
    } else {
      argument -= 1
      this.setValue(node.argument as nodes.Identifier, argument)
    }

    if (node.prefix) {
      return argument
    } else {
      return argumentBefore
    }
  }

  private evaluate_ConditionalExpression(node: nodes.ConditionalExpression) {
    return this.evaluate(node.test)
      ? this.evaluate(node.consequent)
      : this.evaluate(node.alternate)
  }

  private evaluate_CallExpression(node: nodes.CallExpression) {
    let receiver = null
    let callee
    try {
      if (node.callee.type === 'MemberExpression') {
        const {object, value} = this.evaluateMemberExpression(node.callee)
        receiver = object
        callee = value
      } else {
        callee = this.evaluate(node.callee)
      }
    } catch (error) {
      if (/Undefined variable/.test(error.message)) {
        this.throw(ReferenceError, error.message.replace(/Undefined variable/, "Function not found"), node)
      } else {
        this.rethrow(error, node)
      }
    }

    if (callee == null || !isFunction(callee.apply)) {
      const source = this.nodeSource(node.callee)
      const desc = source == null ? 'This' : `\`${source}\``
      this.throw(TypeError, `${desc} is not a function`, node.callee)
    }

    try {
      const args = node.arguments.map(arg => this.evaluate(arg))
      return callee.apply(receiver, args)
    } catch (error) {
      this.rethrow(error, node)
    }
  }

  private evaluate_MemberExpression(node: nodes.MemberExpression) {
    const {value} = this.evaluateMemberExpression(node)
    return value
  }

  private evaluate_ObjectExpression(node: nodes.ObjectExpression) {
    const object: Record<any, any> = {}

    for (const property of node.properties) {
      const key = property.computed
        ? this.evaluate(property.key)  // Computed notation: e.g. {[this.name]: 1}
        : (property.key as nodes.Identifier).name            // Simple notation, e.g. {a: 1}
      const value = this.evaluate(property.value)

      object[key] = value
    }

    return object
  }

  private evaluate_ArrayExpression(node: nodes.ArrayExpression) {
    return node.elements.map(el => this.evaluate(el))
  }

  private evaluate_ThisExpression(node: nodes.ThisExpression) {
    return this.currentScope.receiver
  }

  //------
  // Templates

  private evaluate_TaggedTemplateExpression(node: nodes.TaggedTemplateExpression) {
    const tag = this.evaluate(node.tag)
    return this.evaluateLiteral(tag, node.quasi)
  }

  private evaluate_TemplateLiteral(node: nodes.TemplateLiteral) {
    return this.evaluateLiteral(null, node)
  }

  private evaluateLiteral(tag: TemplateTag | null, node: nodes.TemplateLiteral) {
    const values = node.expressions.map(expr => this.evaluate(expr))

    const strings: string[] = []
    const rawStrings: string[] = [];
    (strings as any).raw = rawStrings
    
    for (const [i, {raw, cooked}] of node.quasis.map(node => node.value).entries()) {
      strings[i] = cooked
      rawStrings[i] = raw
    }

    return (tag || templateDefault)(strings, ...values)
  }

  //------
  // Terminals

  private evaluate_Identifier(node: nodes.Identifier) {
    try {
      return this.currentScope.get(node.name)
    } catch (error) {
      this.rethrow(error, node)
    }
  }

  private evaluate_Literal(node: nodes.Literal) {
    return node.value
  }

  //------
  // Variables & destructuring

  private declareVariable(id: nodes.Pattern, initValue: any, isConstant: boolean, node: nodes.Node) {
    try {
      const variables = {}
      this.destructure(variables, id, initValue)
      for (const key of Object.keys(variables)) {
        this.currentScope.define(key, variables[key], isConstant)
      }
    } catch (error) {
      this.rethrow(error, node)
    }
  }

  public destructure(variables: Variables, id: nodes.Pattern, value: any) {
    if (id.type === 'ArrayPattern') {
      const remaining = [...value]
      for (const element of id.elements) {
        if (element.type === 'RestElement') {
          // TODO
          variables[(element.argument as nodes.Identifier).name] = remaining
          break
        }

        this.destructure(variables, element, remaining.shift())
      }
    } else if (id.type === 'ObjectPattern') {
      const remaining = {...value}
      for (const property of id.properties) {
        const id = property.key as nodes.Identifier
        this.destructure(variables, property.value, value[id.name])
        delete remaining[id.name]
      }
    } else if (id.type === 'Identifier') {
      variables[id.name] = value
    }
  }

  //------
  // Function creation

  private createFunction(node: nodes.BaseFunction, bound: boolean) {
    const {params, body} = node
    const id = functionID(node)
    const fn = new Function(
      this,
      id == null ? null : id.name,
      params,
      body,
      node.type === 'ArrowFunctionExpression' && (node as nodes.ArrowFunctionExpression).expression,
      bound ? this.currentScope.receiver : null
    )

    // Wrap this function into a native JS function.
    const createNative = new (window as any).Function('fn', `
      return function ${fn.name || ''}() {
        return fn.apply(this, arguments)
      }`
    )
    const native = createNative(fn)

    if (id != null) {
      try {
        this.currentScope.define(id.name, native, false)
      } catch (error) {
        this.rethrow(error, id)
      }
    }
    return native
  }

  //------
  // Values & operators

  private unary(operator: string, value: any, node: nodes.Node): any {
    if (operator === 'typeof') {
      // For some inexplicable reason, adding a typeof entry in the unaryOperators object below
      // causes an infinite loop when checking objects. So we check this one like this.
      return typeof value
    }

    const fn = unaryOperators[operator]
    if (fn == null) {
      this.throw(ReferenceError, `Invalid operator: ${operator}`, node)
    }

    return fn(value)
  }

  private binary(operator: string, left: any, right: any, node: nodes.Node): any {
    const fn = binaryOperators[operator]
    if (fn == null) {
      this.throw(ReferenceError, `Invalid operator: ${operator}`, node)
    }

    return fn(left, right)
  }

  private setValue(left: nodes.Identifier | nodes.MemberExpression, value: any) {
    if (left.type === 'Identifier') {
      try {
        this.currentScope.set(left.name, value)
      } catch (error) {
        if (error.name === 'TypeError' && error.message.match(/read only/)) {
          this.throw(TypeError, `Cannot modify constant \`${left.name}\``, left)
        } else {
          this.rethrow(error, left)
        }
      }
    } else if (left.type === 'MemberExpression') {
      const {object: receiver, property} = this.evaluateMemberExpression(left)

      try {
        receiver[property] = value
      } catch (error) {
        this.rethrow(error, left)
      }
    } else {
      this.throw(TypeError, `Invalid assignment left hand side`, left)
    }
  }

  private evaluateMemberExpression(node: nodes.MemberExpression): {object: any, property: string, value: any} {
    const object   = this.evaluate(node.object)
    if (object == null) {
      const source = this.nodeSource(node.object)
      this.throw(ReferenceError, `\`${source}\` is null`, node.object)
    }

    const property = node.computed
      ? this.evaluate(node.property)
      : (node.property as nodes.Identifier).name

    try {
      return {object, property, value: object[property]}
    } catch (error) {
      return this.rethrow(error, node)
    }
  }

  //------
  // Errors & utility

  private nodeSource(node: nodes.Node & {start?: number, end?: number}): string | null {
    if (this.source == null) { return null }
    return this.source.slice(node.start, node.end)
  }

  private throw(ErrorType: RuntimeErrorConstructor, message: string, node: nodes.Node): never {
    return this.rethrow(new ErrorType(message), node)
  }

  private rethrow(error: RuntimeError, node: nodes.Node): never {
    if (typeof node !== 'object' || node.type == null || node.loc == null) {
      throw error
    }

    if (error.node == null) {
      error.node = node
      error.loc  = node.loc
    }
    throw error
  }

}

function functionID(node: nodes.BaseFunction): nodes.Identifier | null {
  if (node.type === 'FunctionExpression') {
    return (node as nodes.FunctionExpression).id || null
  } else if (node.type === 'FunctionDeclaration') {
    return (node as nodes.FunctionDeclaration).id
  } else {
    return null
  }
}

function hoist(nodes: nodes.Node[]) {
  const hoisted: nodes.Node[] = []
  const rest: nodes.Node[] = []

  for (const node of nodes) {
    if (node.type === 'FunctionDeclaration') {
      hoisted.push(node)
    } else {
      rest.push(node)
    }
  }

  return hoisted.concat(rest)
}

function templateDefault(strings: string[], ...values: any[]): string {
  let result = strings[0]
  for (let i = 1; i < strings.length; i++) {
    result += `${values[i - 1]}` + strings[i]
  }
  return result
}

type UnaryOperator = (argument: any) => any
type BinaryOperator = (left: any, right: any) => any

const unaryOperators: {[key: string]: UnaryOperator} = {
  ['!']: val => !val,
  ['-']: val => -val,
  ['~']: val => ~val
}

const binaryOperators: {[key: string]: BinaryOperator} = {
  // Arithmetic
  ['+']: (l, r) => l + r,
  ['-']: (l, r) => l - r,
  ['*']: (l, r) => l * r,
  ['/']: (l, r) => l / r,
  ['%']: (l, r) => l % r,

  // Comparison
  ['==']:  (l, r) => l == r, // tslint:disable-line triple-equals
  ['!=']:  (l, r) => l != r, // tslint:disable-line triple-equals
  ['===']: (l, r) => l === r,
  ['!==']: (l, r) => l !== r,
  ['<']:   (l, r) => l < r,
  ['>']:   (l, r) => l > r,
  ['<=']:  (l, r) => l <= r,
  ['>=']:  (l, r) => l >= r,

  // Boolean
  ['&&']: (l, r) => l && r,
  ['||']: (l, r) => l || r,

  // Bitwise
  ['|']: (l, r) => l | r,
  ['&']: (l, r) => l & r,
  ['^']: (l, r) => l ^ r,
}

export class UnsupportedException extends Error {}