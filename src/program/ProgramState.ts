import Program from './Program'
import {cloneDeep} from 'lodash'

export type Sprite = 'etienne' | 'marie' | 'chef'

export interface SpriteState {
  position: SpritePosition
  speak:    string | null
  flipped:  boolean
  dance:    boolean
}

export enum SpritePosition {
  counterLeft,  // Starting point of Marie
  counterRight, // Marie next to chef
  kitchen,      // Chef
  entrance,     // Starting point of Etienne
  counterFront, // Where Etienne places order
  atTable       // Etienne waiting at a table
}

function defaultSpriteState(position: SpritePosition) {
  return {
    position,
    speak:   null,
    flipped: false,
    dance:   true
  }
}

export default class ProgramState {

  constructor(initialValues: Partial<ProgramState> = {}) {
    Object.assign(this, initialValues)
  }

  public static get default() {
    return new ProgramState({
      sprites: {
        etienne: defaultSpriteState(SpritePosition.entrance),
        marie:   defaultSpriteState(SpritePosition.counterLeft),
        chef:    defaultSpriteState(SpritePosition.kitchen),
      }
    })
  }

  public clone(): ProgramState {
    const values = cloneDeep(this)
    return new ProgramState(values)
  }

  public sprites!: {[key in Sprite]: SpriteState} 

  public prepare() {
    // TODO
  }

}