import Program from './Program'
import {cloneDeep} from 'lodash'

export default class ProgramState {

  constructor(
    public readonly program: Program,
    initialValues: AnyObject = {}
  ) {
    Object.defineProperty(this, 'program', {
      value:        program,
      writable:     false,
      enumerable:   false,
      configurable: false
    })

    Object.assign(this, initialValues)
  }

  public static default(program: Program) {
    return new ProgramState(program, {
    })
  }

  public clone(): ProgramState {
    const values = cloneDeep(this)
    return new ProgramState(this.program, values)
  }

  public prepare() {
    // TODO
  }

}