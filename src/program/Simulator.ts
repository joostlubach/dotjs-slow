import EventEmitter from 'events'
import Simulation from './Simulation'
import {Step} from '.'

export interface Options {
  fps?:     number
  verbose?: boolean
}

export default class Simulator extends EventEmitter {

  constructor(
    public readonly simulation: Simulation,
    options: Options = {}
  ) {
    super()

    this.simulation = simulation
    Object.assign(this, options)
  }

  private currentStepIndex: number = -1

  public verbose: boolean = false
  public fps:     number  = 2

  public get frameDuration(): number {
    return 1000 / this.fps
  }

  public get atStart(): boolean {
    return this.currentStepIndex === -1
  }

  public get atEnd(): boolean {
    return this.currentStepIndex === this.simulation.steps.length - 1
  }

  //------
  // Playback

  private playbackTimeout: number | null = null

  public pause() {
    if (this.playbackTimeout != null) {
      window.clearTimeout(this.playbackTimeout)
    }
  }

  public resume() {
    this.displayStep(this.currentStepIndex + 1, 1, this.resumePlayback.bind(this))
  }

  public forward(callback?: () => void) {
    this.displayStep(this.currentStepIndex + 1, 1, callback || (() => null))
  }

  public backward(callback?: () => void) {
    if (this.currentStepIndex === -1) { return }
    this.displayStep(this.currentStepIndex - 1, -1, callback || (() => null))
  }

  public goTo(index: number, callback?: () => void) {
    if (index < 0 || index >= this.simulation.steps.length) { return }
    this.displayStep(index, 0, callback || (() => null))
  }

  public displayStep(index: number, direction: number, callback: () => void) {
    const step = this.simulation.steps[index]
    if (index >= this.simulation.steps.length) {
      this.emit('done')
      return
    }

    this.currentStepIndex = index

    if (!this.verbose && direction !== 0 && step && !step.actionPerformed) {
      // We're skipping steps that have not executed any simulation actions.
      this.displayStep(index + direction, direction, callback)
    } else {
      this.emit('step', index, step)

      if (this.playbackTimeout != null) {
        window.clearTimeout(this.playbackTimeout)
      }

      this.playbackTimeout = window.setTimeout(callback, this.frameDuration)
    }
  }

  private resumePlayback() {
    this.displayStep(this.currentStepIndex + 1, 1, this.resumePlayback.bind(this))
  }

}