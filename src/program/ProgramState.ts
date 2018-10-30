import Program from './Program'
import {cloneDeep} from 'lodash'

export type Sprite = 'etienne' | 'marie' | 'mrSlow'

export interface SpriteState {
  position: SpritePosition
  speak:    string | null
  dance:    boolean
}

export enum SpritePosition {
  counterLeft,  // Starting point of Marie
  counterRight, // Marie next to mrSlow
  kitchen,      // MrSlow
  entrance,     // Starting point of Etienne
  counterFront, // Where Etienne places order
  atTable       // Etienne waiting at a table
}

function defaultSpriteState(position: SpritePosition) {
  return {
    position,
    speak: null,
    dance: true
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
        mrSlow:  defaultSpriteState(SpritePosition.kitchen),
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