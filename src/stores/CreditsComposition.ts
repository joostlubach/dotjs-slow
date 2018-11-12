import programStore from './programStore'
import {Scenario, ProgramState} from '@src/program'
import simulatorStore from './simulatorStore'

export default class CreditsComposition {

  private timeouts: Set<number> = new Set()

  private previousScenario: Scenario | null = null

  private state: ProgramState = (() => {
    const state = ProgramState.default(creditsScenario)
    state.prepTimesShown = false
    return state
  })()

  public start() {
    this.previousScenario = programStore.scenario
    programStore.scenario = creditsScenario
    simulatorStore.stateOverride = this.state

    this.after(2000, () => {
      this.state = this.state.clone()
      this.state.showCredits = true
      simulatorStore.stateOverride = this.state
    })
  }

  public stop() {
    this.clearAllTimeouts()

    if (this.previousScenario) {
      programStore.scenario = this.previousScenario
      this.previousScenario = null
    }

    simulatorStore.stateOverride = null
  }

  private after(ms: number, callback: () => any) {
    const timeout = window.setTimeout(() => {
      this.timeouts.delete(timeout)
      callback()
    }, ms)
    this.timeouts.add(timeout)
  }

  private clearAllTimeouts() {
    for (const timeout of this.timeouts) {
      window.clearTimeout(timeout)
    }
    this.timeouts.clear()
  }

}

const creditsScenario = Scenario.load({
  name:  'credits',
  title: "Credits",

  full_screen: true,
  stage:      'credits'
})