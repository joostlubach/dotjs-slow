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

  private currentNode: Node | null = null

  public record() {
    this.prepareRecording()

    return this.program.run({
      node:          this.onNode,
      stateModified: this.onStateModified
    })
  }

  private prepareRecording() {
    this.simulation.reset()
    this.currentNode = null
  }

  private onNode = (node: Node) => {
    if ((node as RecordableNode).recordable) {
      this.currentNode = node
    }
  }

  private onStateModified = (prevState: ProgramState, nextState: ProgramState, added: boolean) => {
    if (!added) { return }

    const step: Step = {
      codeLocation: this.currentNode != null && this.currentNode.loc || null,
      startState:   prevState,
      endState:     nextState
    }
    this.simulation.addStep(step)
  }

}