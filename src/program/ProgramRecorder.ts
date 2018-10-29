import Program from './Program'
import {Node, SourceLocation} from 'estree'
import {Step, RecordableNode} from './types'
import Simulation from './Simulation';

export default class ProgramRecorder {

  //------
  // Constructor

  constructor(
    readonly program: Program
  ) {}

  public readonly simulation = new Simulation()

  public record() {
    this.startRecording()
    const success = this.program.run({
      node: this.onNode
    })
    this.stopRecording()

    return success
  }

  private onNode = (node: Node) => {
    if ((node as RecordableNode).recordable) {
      this.recordStep(node.loc || null)
    }
  }


  //------
  // Actions

  protected beforeAction() {
    if (this.recordingStep != null) {
      this.recordingStep.actionPerformed = true
    }
  }

  protected afterAction() {
    // TODO
  }

  //------
  // Recording

  private recordingStep: Step | null = null

  private startRecording() {
    this.simulation.reset()
    this.recordingStep = null
  }

  private recordStep(codeLocation: SourceLocation | null): Step {
    const state = this.program.cloneState()
    if (this.recordingStep != null) {
      this.recordingStep.endState = state
    }

    const step = {codeLocation, startState: state, endState: state, actionPerformed: false}
    this.simulation.addStep(step)
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

    this.recordingStep.endState = this.program.cloneState()
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