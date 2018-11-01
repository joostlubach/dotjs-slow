import Scenario from './Scenario'
import {Stage, Character} from './types'
import {cloneDeep} from 'lodash'

export interface SpriteState {
  position: SpritePosition | null
  speak:    string | null
  face:     string
  hold:     string | null
  flipped:  boolean
  moving:   boolean
}

export enum SpritePosition {
  counterLeft,  // Starting point of Marie
  counterRight, // Marie next to chef
  kitchen,      // Chef
  entrance,     // Starting point of Etienne
  counterFront, // Where Etienne places order
  atTable,      // Etienne waiting at a table

  outsideDoor,
  outsideLeft,
  outsideCenter,
  outsideRight
}

export interface StoveState {
  panContent: string | null
}

const defaultStoveState = {
  panContent: null
}

function defaultSpriteState(position: SpritePosition | null, flipped?: boolean) {
  return {
    position,
    speak:   null,
    face:    'happy',
    hold:    null,
    flipped: flipped || false,
    moving:  true
  }
}

export default class ProgramState {

  constructor(initialValues: Partial<ProgramState> = {}) {
    Object.assign(this, initialValues)
  }

  public static default(scenario: Scenario) {
    return new ProgramState({
      stage:   scenario.stage,
      stove:   defaultStoveState,
      sprites: {
        etienne: defaultSpriteState(scenario.initialPositions.etienne, scenario.initialFlipped.etienne),
        marie:   defaultSpriteState(scenario.initialPositions.marie, scenario.initialFlipped.marie),
        chef:    defaultSpriteState(scenario.initialPositions.chef, scenario.initialFlipped.chef),
      }
    })
  }

  public clone(): ProgramState {
    const values = cloneDeep(this)
    return new ProgramState(values)
  }

  public stage:  Stage = 'interior'
  public stove!: StoveState
  public sprites!: {[key in Character]: SpriteState} 

  public heart?: 'static' | 'animating'
  public theEnd?: boolean

}