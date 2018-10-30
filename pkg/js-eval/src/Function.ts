import {Runtime, Scope} from '.'
import {Node, ArrayPattern} from 'estree'

export default class Function {

  constructor(
    public readonly runtime: Runtime,
    public readonly name: string | null,
    public readonly params: Node[],
    public readonly body: Node,
    public readonly expression: boolean,
    public readonly boundReceiver: any
  ) {
    this.parentScope = runtime.currentScope
  }

  private parentScope: Scope

  public apply(receiver: object, args: any[]) {
    const scope = new Scope(this.parentScope)
    return this.runtime.withScope(scope, () => {
      this.assignArguments(scope, args)
      if (this.boundReceiver) {
        scope.receiver = this.boundReceiver
      } else {
        scope.receiver = receiver
      }

      if (this.expression) {
        return this.runtime.evaluate(this.body)
      } else {
        this.runtime.evaluate(this.body)
        return scope.retval
      }
    })
  }

  private assignArguments(scope: Scope, args: any[]) {
    const id = {
      type:     'ArrayPattern',
      elements: this.params
    } as ArrayPattern

    const destructured = {}
    this.runtime.destructure(destructured, id, args)

    scope.assign(destructured)
  }

}