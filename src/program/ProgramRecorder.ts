import Program from './Program'
import {Node, SourceLocation} from 'estree'
import {Step, RecordableNode} from './types'
import Simulation from './Simulation';
import ProgramState from './ProgramState';

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
      node:          this.onNode,
      stateModified: this.onStateModified
    })
    this.stopRecording()

    return success
  }

  private onNode = (node: Node) => {
    if ((node as RecordableNode).recordable) {
      this.recordStep(node.loc || null)
    }
  }

  private onStateModified = (prevState: ProgramState, nextState: ProgramState) => {
    // If the state is modified twice, we need to add a new step. This is the case if prevState is not the
    // current step's start state.
    if (this.recordingStep != null && prevState !== this.recordingStep.startState) {
      this.recordingStep.endState = prevState

      const step = {...this.recordingStep, startState: prevState, endState: nextState}
      this.simulation.addStep(step)
      this.recordingStep = step
    }
  }

  //------
  // Recording

  private recordingStep: Step | null = null

  private startRecording() {
    this.simulation.reset()
    this.recordingStep = null
  }

  private recordStep(codeLocation: SourceLocation | null): Step {
    const state = this.program.getState()
    if (this.recordingStep != null) {
      this.recordingStep.endState = state
    }

    const step = {codeLocation, startState: state, endState: state}
    this.simulation.addStep(step)
    this.recordingStep = step
    return step
  }

  public stopRecording() {
    if (this.recordingStep == null) { return }

    this.recordingStep.endState = this.program.getState()
    this.recordingStep = null
  }

}