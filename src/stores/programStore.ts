import EventEmitter from 'events'
import {observable, action, computed} from 'mobx'
import {Program, ProgramRecorder, CodeError, Scenario, Simulation, Source} from '../program'
import simulatorStore from './simulatorStore'
import scenarios from '@src/scenarios'

export class ProgramStore extends EventEmitter {

  @observable
  public scenario: Scenario | null = null

  @observable
  public codes: Record<string, string> = {}

  @observable
  public errors: CodeError[] = []

  @observable
  public hasInfiniteLoop: boolean = false

  @action
  public loadScenario(name: keyof typeof scenarios) {
    const scenario = scenarios[name]
    this.installScenario(scenario)
  }

  @action
  public resetScenario() {
    if (this.scenario) {
      this.installScenario(this.scenario)
    }
  }

  @action
  private installScenario(scenario: Scenario) {
    this.scenario = scenario
    this.codes = scenario.codes

    simulatorStore.reset()
    this.errors = []
    this.hasInfiniteLoop = false
  }

  @action
  public buildSimulation() {
    const {scenario} = this
    if (scenario == null) { return }

    // Create a new program.
    const program = new Program(scenario, scenario.codes, {bootstrap: scenario.bootstrap})
    if (!program.compile()) {
      this.errors = program.errors
      return null
    }

    // Record the program. Stop if there's any compilation or runtime error.
    return this.recordProgram(program)
  }

  @action
  private recordProgram(program: Program): Simulation | null {
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