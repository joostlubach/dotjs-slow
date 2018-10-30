import {Step} from './types'

export default class Simulation {

  public readonly steps: Step[] = []

  public reset() {
    this.steps.splice(0, this.steps.length)
  }

  public addStep(step: Step) {
    this.steps.push(step)
  }

}