import EventEmitter from 'events'
import Simulation from './Simulation'
import {Step} from '.'
import {observable} from 'mobx'

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

    this.steps = simulation.getSteps(options.verbose || false)
    Object.assign(this, options)
  }

  public readonly steps: Step[]

  @observable
  private currentStepIndex: number = -1

  public readonly verbose: boolean = false
  public fps:     number  = 2

  public get frameDuration(): number {
    return 1000 / this.fps
  }

  public get atStart(): boolean {
    return this.currentStepIndex === -1
  }

  public get atEnd(): boolean {
    return this.currentStepIndex === this.steps.length - 1
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

  public forward() {
    this.displayStep(this.currentStepIndex + 1, 1)
  }

  public backward() {
    if (this.currentStepIndex === -1) { return }
    this.displayStep(this.currentStepIndex - 1, -1)
  }

  public goTo(index: number, callback?: () => void) {
    if (index < 0 || index >= this.steps.length) { return }
    this.displayStep(index, 0, callback || (() => null))
  }

  public displayStep(index: number, direction: number, callback?: () => void) {
    if (index < -1) { return }
    if (index >= this.steps.length) {
      this.emit('done')
      return
    }

    const step = this.steps[index]
    this.currentStepIndex = index

    this.emit('step', index, step)

    if (this.playbackTimeout != null) {
      window.clearTimeout(this.playbackTimeout)
    }

    if (callback) {
      this.playbackTimeout = window.setTimeout(callback, this.frameDuration)
    }
  }

  private resumePlayback() {
    this.displayStep(this.currentStepIndex + 1, 1, this.resumePlayback.bind(this))
  }

}