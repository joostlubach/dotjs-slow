import Scope from './Scope'
import {Variables} from './types'

export default class Context extends Scope {

  constructor(variables: Variables = {}) {
    super(null, variables)
  }

  public has(name: string): boolean {
    return name in this.variables || name in window
  }

  public get(name: string): any {
    if (name in this.variables) {
      return this.variables[name]
    } else {
      throw new ReferenceError(`Undefined variable: \`${name}\``)
    }
  }

}