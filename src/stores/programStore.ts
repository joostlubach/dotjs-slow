import EventEmitter from 'events'
import {observable, action, computed} from 'mobx'
import {Program, ProgramRecorder, CodeError, Scenario, Simulation, Source} from '../program'
import simulatorStore from './simulatorStore'
import CreditsComposition from './CreditsComposition'

export class ProgramStore extends EventEmitter {

  @observable
  public scenario: Scenario | null = null

  @observable
  public codes: Record<string, string> = {}

  @observable
  public errors: CodeError[] = []

  @observable
  public creditsComposition: CreditsComposition | null = null

  @action
  public resetScenario() {
    if (this.scenario) {
      this.loadScenario(this.scenario)
    }
  }

  @action
  public loadScenario(scenario: Scenario) {
    if (this.creditsComposition != null) {
      this.creditsComposition.stop()
      this.creditsComposition = null
    }

    this.scenario = scenario
    this.codes = scenario.codes

    simulatorStore.reset()
    this.errors = []
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

    const success = recorder.record()
    this.errors = program.errors

    return success ? recorder.simulation : null
  }

  @action
  public showCredits() {
    simulatorStore.pause()

    this.creditsComposition = new CreditsComposition()
    this.creditsComposition.start()
  }

  @action
  public hideCredits() {
    if (this.creditsComposition == null) { return }

    this.creditsComposition.stop()
    this.creditsComposition = null
    simulatorStore.reset()
  }

}

export default new ProgramStore()