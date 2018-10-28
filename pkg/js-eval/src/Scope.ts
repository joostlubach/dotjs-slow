import {Variables} from './types'

export default class Scope {

  constructor(
    public readonly parent:    Scope | null,
    public readonly variables: Variables = {}
  ) {}

  public receiver:  any = null
  public retval:    any
  public interrupt: boolean = false

  public has(name: string): boolean {
    if (name in this.variables) { return true }

    return this.parent != null && this.parent.has(name)
  }

  public define(name: string, initialValue: any, constant: boolean) {
    Object.defineProperty(this.variables, name, {
      value:        initialValue,
      writable:     !constant,
      configurable: false,
      enumerable:   true
    })
  }

  public assign(variables: Variables, constants: boolean = false) {
    for (const [key, value] of Object.entries(variables)) {
      this.define(key, value, constants)
    }
  }

  public set(name: string, value: any) {
    if (name in this.variables) {
      this.variables[name] = value
    } else if (this.parent != null) {
      this.parent.set(name, value)
    } else {
      throw new ReferenceError(`Undefined variable: \`${name}\``)
    }
  }

  public get(name: string): any {
    if (name in this.variables) {
      return this.variables[name]
    } else if (this.parent != null) {
      return this.parent.get(name)
    } else {
      throw new ReferenceError(`Undefined variable: \`${name}\``)
    }
  }

}