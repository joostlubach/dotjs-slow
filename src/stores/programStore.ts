import EventEmitter from 'events'
import {observable, autorun, action} from 'mobx'
import {Program, ProgramBuilder, CodeError} from '../program'
import simulatorStore from './simulatorStore'

export class ProgramStore extends EventEmitter {

  constructor() {
    super()
    // TODO
    // autorun(() => { this.saveCode() })
  }

  @observable
  public code: string = ''

  @observable
  public program: Program | null = null

  @observable
  public errors: CodeError[] = []

  @observable
  public hasInfiniteLoop: boolean = false

  // private loadCode(scenario: string) {
  //   const codes = JSON.parse(window.localStorage.codes || '{}')
  //   this.code = codes[scenario.name]
  //   if (this.code == null) {
  //     this.code = scenario.initialCode
  //   }

  //   simulatorStore.reset()
  //   this.errors = []
  //   this.program = null
  //   this.hasInfiniteLoop = false
  // }

  // private saveCode() {

  // }

  @action
  public runAndSimulate(firstStepOnly: boolean = false) {
    // Create a new program.
    const program = this.program = new Program(this.code)

    // Run the program (record it). Stop if there's any compilation or runtime error.
    const success = this.runProgram(program)
    if (!success) { return }

    // Prepare for simulation.
    simulatorStore.reset()

    // Run a simulation, displaying all steps.
    simulatorStore.simulate(this.program!, firstStepOnly)
  }

  @action
  private runProgram(program: Program) {
    if (simulatorStore.active) { return false }

    // Use the students code to build the program.
    const builder = new ProgramBuilder(program)

    try {
      const success = builder.build(this.code)
      this.hasInfiniteLoop = false
      this.errors = builder.errors

      return success
    } catch (error) {
      if (error.name === 'InfiniteLoopException') {
        this.hasInfiniteLoop = true
        return false
      } else {
        throw error
      }
    }
  }

}

export default new ProgramStore()