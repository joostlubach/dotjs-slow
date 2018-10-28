import {parse} from 'acorn'
import * as nodes from 'estree'
import {SourceLocation} from 'estree'
import {Runtime} from 'js-eval'
import * as walk from 'acorn/dist/walk'
import Program from './Program'
import {CodeError, Recordable, RecordableNode} from './types'

export default class ProgramBuilder {

  constructor(
    public readonly program: Program
  ) {}

  public readonly errors: CodeError[]  = []

  private runtime: Runtime | null = null

  private evaluatedNodes: number = 0

  public build(code: string): boolean {
    const ast = this.compile(code)
    if (ast == null) { return false }

    return this.run(ast)
  }

  private compile(code: string) {
    try {
      const program = parse(code, {
        sourceType: 'script',
        locations:  true
      })
      markRecordableNodes(program)
      return program
    } catch (error) {
      if (error.name !== 'SyntaxError') {
        throw error
      }

      this.errors.push(CompileError.fromSyntaxError(error))
      return null
    }
  }

  public run(ast: nodes.Node) {
    const runtime = this.runtime = new Runtime({
      source: this.program.code,
      callbacks: {
        node: (node: nodes.Node) => {
          if (this.evaluatedNodes++ > 10000) {
            throw new InfiniteLoopException()
          }

          if ((node as RecordableNode).recordable) {
            this.program.recordStep(node.loc || null)
          }
        }
      }
    })

    try {
      // TODO
      // if (this.program.level.style === 'basic') {
      //   runtime.context.assign(this.program.interface, true)
      // }

      this.program.startRecording()
      runtime.evaluate(ast)
      this.program.stopRecording()
      return true
    } catch (error) {
      if (isCodeError(error)) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error) // tslint:disable-line no-console
        }
        this.errors.push(error)
      } else {
        throw error
      }

      return false
    }
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
  message = "Your program contains an infinite loop"
}

export class CompileError extends Error implements CodeError {
  constructor(message: string, node: nodes.Node | null, loc: SourceLocation) {
    super(message)
    this.node = node
    this.loc = loc
  }

  static fromSyntaxError(error: any) {
    return new this(error.message, null, {start: error.loc, end: error.loc})
  }

  node: nodes.Node | null
  loc:  SourceLocation
}