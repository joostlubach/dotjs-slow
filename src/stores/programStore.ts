import EventEmitter from 'events'
import {observable, action} from 'mobx'
import {Program, ProgramRecorder, CodeError, Scenario, Simulation} from '../program'
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
    this.hasInfiniteLoop = false
  }

  @action
  public buildSimulation() {
    // Create a new program.
    const program = new Program(this.etienneCode)
    if (!program.compile()) {
      this.errors = program.errors
      return null
    }

    // Record the program. Stop if there's any compilation or runtime error.
    const simulation = this.recordProgram(program)
    if (simulation == null) { return }

    return simulation
  }

  @action
  private recordProgram(program: Program): Simulation | null {
    if (simulatorStore.active) { return null }

    // Use the students code to build the program.
    const recorder = new ProgramRecorder(program)

    try {
      const success = recorder.record()
      this.hasInfiniteLoop = false
      this.errors = program.errors

      return success ? recorder.simulation : null
    } catch (error) {
      if (error.name === 'InfiniteLoopException') {
        this.hasInfiniteLoop = true
        return null
      } else {
        throw error
      }
    }
  }

}

export default new ProgramStore()