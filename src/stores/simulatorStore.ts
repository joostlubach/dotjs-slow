import {observable, computed, action, autorun} from 'mobx'
import {Simulator, Simulation, Step, ProgramState} from '@src/program'

export class SimulatorStore {

  constructor() {
    autorun(() => {
      localStorage.verbose = JSON.stringify(this.verbose)
      if (this.simulator != null) {
        this.simulator.verbose = this.verbose
      }
    })

    autorun(() => {
      localStorage.fps = JSON.stringify(this.fps)
      if (this.simulator != null) {
        this.simulator.fps = this.fps
      }
    })
  }

  /** The currently active simulator. */
  @observable
  public simulator: Simulator | null = null

  /** The index of the most recently (or currently) executed step. */
  @observable
  public currentStepIndex: number | null = null

  /** The most recently (or currently) executed step. */
  @observable
  public currentStep: Step | null = null

  @computed
  public get atStart(): boolean {
    if (this.simulator == null) { return false }
    return this.simulator.atStart
  }

  @computed
  public get atEnd(): boolean {
    if (this.simulator == null) { return false }
    return this.simulator.atEnd
  }

  @computed
  public get state(): ProgramState {
    if (this.currentStep != null) {
      return this.currentStep.endState
    } else if (
      this.simulator != null &&
      this.currentStepIndex != null && this.currentStepIndex < 0 &&
      this.simulator.simulation.steps.length > 0
    ) {
      return this.simulator.simulation.steps[0].startState
    } else {
      return ProgramState.default
    }
  }

  /** Whether the simulator is currently running (and not paused). */
  @observable
  public running: boolean = false

  /** Whether there is currently a simulation active (albeit paused). */
  @computed
  public get active(): boolean {
    return this.currentStep != null
  }

  /** Whether the current simulation is done. */
  @observable
  public done: boolean = false

  @observable
  public verbose: boolean = JSON.parse(localStorage.verbose || 'false')

  @observable
  public fps: number = JSON.parse(localStorage.fps || '2')

  /** Resets everything to default values. */
  @action
  public reset() {
    this.currentStep = null
    this.done        = false
    this.cleanUp()
  }

  /** Cleans up after a simulation is complete, but leaves some state intact. */
  @action
  public cleanUp() {
    if (this.simulator != null) {
      this.simulator.removeAllListeners()
    }

    this.simulator   = null
    this.running     = false
  }

  /** Starts simulating a simulation. If a current simulation was in progress, it is terminated. */
  @action
  public simulate(simulation: Simulation, firstStepOnly: boolean = false) {
    this.reset()

    this.simulator = new Simulator(simulation)
    this.simulator.fps = this.fps
    this.simulator.verbose = this.verbose

    this.simulator.on('step', this.onSimulatorStep)
    this.simulator.on('done', this.onSimulatorDone)

    if (firstStepOnly) {
      this.forward()
    } else {
      this.resume()
    }
  }

  /** Pauses the current simulation. */
  @action
  public pause() {
    if (!this.running || this.simulator == null) { return }

    this.running = false
    this.simulator.pause()
  }

  /** Resumes the current simulation. */
  @action
  public resume() {
    if (this.running || this.simulator == null) { return }

    this.running = true
    this.simulator.resume()
  }

  @action
  public forward() {
    if (this.running || this.simulator == null) { return }
    
    this.running = true
    this.simulator.forward(() => {
      this.running = false
    })
  }

  @action
  public backward() {
    if (this.running || this.simulator == null) { return }

    this.running = true
    this.simulator.backward(() => {
      this.running = false
    })
  }

  @action
  private onSimulatorStep = (index: number, step: Step | null) => {
    this.currentStepIndex = index
    this.currentStep = step
  }

  @action
  private onSimulatorDone = () => {
    this.done = true
    this.cleanUp()
  }

}

export default new SimulatorStore()