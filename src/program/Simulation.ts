import {Step} from './types'

export default class Simulation {

  public readonly steps: Step[] = []

  public get isEmpty(): boolean {
    return this.steps.filter(step => step.actionPerformed).length === 0
  }

  public reset() {
    this.steps.splice(0, this.steps.length)
  }

  public addStep(step: Step) {
    this.steps.push(step)
  }

}