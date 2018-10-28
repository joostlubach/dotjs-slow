import EventEmitter from 'events'
import {Program, Step} from '.'

export interface Options {
  fps?:     number
  verbose?: boolean
}

export default class Simulator extends EventEmitter {

  constructor(
    public readonly program: Program,
    options: Options = {}
  ) {
    super()

    this.program = program
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
    return this.currentStepIndex === this.program.steps.length - 1
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
    this.displayStep(this.currentStepIndex + 1, 1, callback)
  }

  public backward(callback?: () => void) {
    if (this.currentStepIndex === -1) { return }
    this.displayStep(this.currentStepIndex - 1, -1, callback)
  }

  public goTo(index: number) {
    if (index < 0 || index >= this.program.steps.length) { return }
    this.displayStep(index, 0)
  }

  public displayStep(index: number, direction: number, callback: (() => void) | null = null) {
    const step = this.program.steps[index]
    if (index >= this.program.steps.length) {
      this.emitDone()
      return
    }

    this.currentStepIndex = index

    if (!this.verbose && direction !== 0 && step && !step.actionPerformed) {
      // We're skipping steps that have not executed any program actions.
      this.displayStep(index + direction, direction, callback)
    } else {
      this.emitStep(index, step)

      if (this.playbackTimeout != null) {
        window.clearTimeout(this.playbackTimeout)
      }

      if (step != null) {
        this.playbackTimeout = window.setTimeout(this.emitDone.bind(this), this.frameDuration)
      } else if (callback) {
        this.playbackTimeout = window.setTimeout(callback, this.frameDuration)
      }
    }
  }

  private resumePlayback() {
    this.displayStep(this.currentStepIndex + 1, 1, this.resumePlayback.bind(this))
  }

  private emitStep(index: number, step: Step | null) {
    this.emit('step', index, step)
  }

  private emitDone() {
    this.emit('done')
  }

}