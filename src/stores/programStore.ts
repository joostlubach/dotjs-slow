import EventEmitter from 'events'
import {observable, autorun, action} from 'mobx'
import {Program, ProgramBuilder, CodeError, Scenario} from '../program'
import simulatorStore from './simulatorStore'

interface Code {
  etienne: string
  server:   string
  chef:     string
}

export class ProgramStore extends EventEmitter {

  @observable
  public scenario: Scenario | null = null

  @observable
  public etienneCode: string = ''

  @observable
  public serverCode: string = ''

  @observable
  public chefCode: string = ''

  @observable
  public program: Program | null = null

  @observable
  public errors: CodeError[] = []

  @observable
  public hasInfiniteLoop: boolean = false

  @action
  public loadScenario(scenario: Scenario) {
    this.scenario = scenario
    this.etienneCode = scenario.code.etienne
    this.serverCode = scenario.code.server
    this.chefCode = scenario.code.chef

    simulatorStore.reset()
    this.errors = []
    this.program = null
    this.hasInfiniteLoop = false
  }

  @action
  public runAndSimulate(firstStepOnly: boolean = false) {
    // Create a new program.
    const program = this.program = new Program(this.etienneCode)

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
      const success = builder.build()
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