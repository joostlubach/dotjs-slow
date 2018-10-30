import {parse} from 'acorn'
import * as nodes from 'estree'
import {Program as ESTreeProgram, Node, SourceLocation} from 'estree'
import {Runtime, Callbacks} from 'js-eval'
import * as walk from 'acorn/dist/walk'
import {CodeError, Recordable, RecordableNode} from './types'
import ProgramState from './ProgramState'
import ActorClasses from './actors'
import {cloneDeep} from 'lodash'

export default class Program {

  constructor(
    public readonly code: string,
  ) {}

  public readonly errors: CodeError[]  = []

  //------
  // Compile

  public ast: ESTreeProgram | null = null

  public compile() {
    if (this.ast != null) { return }

    try {
      const ast = parse(this.code, {
        sourceType: 'script',
        locations:  true
      })
      markRecordableNodes(ast)
      this.ast = ast
      return true
    } catch (error) {
      if (error.name !== 'SyntaxError') { throw error }
      this.errors.push(CompileError.fromSyntaxError(error))
      return false
    }
  }

  //------
  // Evaluation

  private evaluatedNodes: number = 0

  public run(callbacks: Callbacks = {}) {
    if (this.ast == null) {
      throw new Error("Program not yet compiled")
    }

    try {
      const runtime = this.createRuntime(callbacks)

      // Set everything up
      this.prepare(runtime)

      // Evaluate the program.
      runtime.evaluate(this.ast)

      // "Commit" by invoking Etienne's onHungry handler.
      this.commit(runtime)
      
      return true
    } catch (error) {
      this.handleError(error)
      return false
    }
  }

  private createRuntime(callbacks: Callbacks = {}) {
    return new Runtime({
      source: this.code,
      callbacks: {
        ...callbacks,
        node: node => this.onNode(node, callbacks.node)
      }
    })
  }

  private prepare(runtime: Runtime) {
    this.createActors()
    runtime.context.assign(this.actors)
  }

  private commit(runtime: Runtime) {
    const {etienne} = this.actors
    if (etienne.onHungry) {
      etienne.onHungry()
    }
  }

  private handleError(error: Error) {
    if (isCodeError(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error) // tslint:disable-line no-console
      }
      this.errors.push(error)
    } else {
      throw error
    }
  }

  private onNode = (node: Node, upstream?: Callbacks['node']) => {
    if (this.evaluatedNodes++ > 10000) {
      throw new InfiniteLoopException()
    }

    if (upstream) {
      upstream(node)
    }
  }

  //------
  // Program state & actors

  private state: ProgramState = ProgramState.default

  private actors!: {[name in keyof ActorClasses]: InstanceType<ActorClasses[name]>}

  private createActors() {
    this.actors = {} as {[name in keyof ActorClasses]: InstanceType<ActorClasses[name]>}
    for (const [name, Actor] of Object.entries(ActorClasses)) {
      this.actors[name] = new Actor(this)
    }
  }

  public getState() {
    return this.state
  }

  public modifyState(callback: (state: ProgramState) => any) {
    this.state = cloneDeep(this.state)
    callback(this.state)
  }

}

function isCodeError(error: Error): error is CodeError {
  return (error as any).node != null && (error as any).loc != null
}

function markRecordableNodes(ast: nodes.Node) {
  walk.ancestor(ast, {
    VariableDeclaration(node: Recordable<nodes.VariableDeclaration>) {
      node.recordable = true
    },
    FunctionDeclaration(node: Recordable<nodes.FunctionDeclaration>) {
      node.recordable = true
    },
    IfStatement(node: Recordable<nodes.IfStatement>) {
      (node.test as RecordableNode).recordable = true
    },
    SwitchStatement(node: Recordable<nodes.SwitchStatement>) {
      (node.discriminant as RecordableNode).recordable = true
    },
    WhileStatement(node: Recordable<nodes.WhileStatement>) {
      (node.test as RecordableNode).recordable = true
    },
    ForStatement(node: Recordable<nodes.ForStatement>) {
      (node.init as RecordableNode).recordable = true;
      (node.test as RecordableNode).recordable = true;
      (node.update as RecordableNode).recordable = true
    },
    ForOfStatement(node: Recordable<nodes.ForOfStatement>) {
      (node.left as RecordableNode).recordable = true
    },
    ForInStatement(node: Recordable<nodes.ForInStatement>) {
      (node.left as RecordableNode).recordable = true
    },
    ReturnStatement(node: Recordable<nodes.ReturnStatement>) {
      node.recordable = true
    },
    BreakStatement(node: Recordable<nodes.BreakStatement>) {
      node.recordable = true
    },
    ContinueStatement(node: Recordable<nodes.ContinueStatement>) {
      node.recordable = true
    },
    ExpressionStatement(node: Recordable<nodes.ExpressionStatement>) {
      if (node.expression.type !== 'CallExpression') {
        node.recordable = true
      }
    },
    CallExpression(node: Recordable<nodes.CallExpression>) {
      node.recordable = true
    }
  })
}

export class InfiniteLoopException extends Error {
  public message = "Your program contains an infinite loop"
}

export class CompileError extends Error implements CodeError {
  constructor(message: string, node: nodes.Node | null, loc: SourceLocation) {
    super(message)
    this.node = node
    this.loc = loc
  }

  public static fromSyntaxError(error: any) {
    return new this(error.message, null, {start: error.loc, end: error.loc})
  }

  public node: nodes.Node | null
  public loc:  SourceLocation
}