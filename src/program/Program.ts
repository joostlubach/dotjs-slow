import {ProgramState} from '.'
import {SourceLocation} from 'estree'
import {Step} from './types'

export default class Program {

  //------
  // Constructor

  constructor(
    readonly code: string
  ) {}

  public state = ProgramState.default

  public get isEmpty(): boolean {
    return this.steps.filter(step => step.actionPerformed).length === 0
  }

  //------
  // Reset

  public reset() {
    this.state = ProgramState.default
  }

  //------
  // Actions

  protected beforeAction() {
    this.state.prepare()
    if (this.recordingStep != null) {
      this.recordingStep.actionPerformed = true
    }
  }

  protected afterAction() {
    // TODO
  }

  //------
  // Recording

  public readonly steps: Step[] = []
  private recordingStep: Step | null = null

  public startRecording() {
    this.steps.splice(0, this.steps.length)
    this.recordingStep = null
  }

  public recordStep(codeLocation: SourceLocation | null): Step {
    const state = this.state.clone()
    if (this.recordingStep != null) {
      this.recordingStep.endState = state
    }

    const step = {codeLocation, startState: state, endState: state, actionPerformed: false}
    this.steps.push(step)
    this.recordingStep = step
    return step
  }

  public splitStep() {
    const {recordingStep} = this
    if (recordingStep == null) { return }

    const step = this.recordStep(recordingStep.codeLocation)
    step.actionPerformed = recordingStep.actionPerformed
    return step
  }

  public stopRecording() {
    if (this.recordingStep == null) { return }

    this.recordingStep.endState = this.state.clone()
    this.recordingStep = null
  }

}

function action(target: Program, key: string, descriptor: PropertyDescriptor) {
  return {
    ...descriptor,
    value: wrapAction(descriptor.value)
  }
}

function wrapAction<F extends AnyFunction>(fn: F): F {
  return function wrapped(this: Program) {
    const program = this as any
    program.beforeAction()
    try {
      return fn.apply(this, arguments)
    } finally {
      program.afterAction()
    }
  } as any
}