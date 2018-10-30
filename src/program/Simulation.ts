import {Step} from './types'

export default class Simulation {

  private readonly steps: Step[] = []

  public getSteps(verbose: boolean) {
    if (verbose) {
      return [...this.steps]
    } else {
      return this.steps.filter(step => step.endState !== step.startState)
    }
  }

  public reset() {
    this.steps.splice(0, this.steps.length)
  }

  public addStep(step: Step) {
    this.steps.push(step)
  }

}