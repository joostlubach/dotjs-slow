import Program from './Program'
import {cloneDeep} from 'lodash'

export type Sprite = 'etienne' | 'server' | 'chef'
export enum SpritePosition {
  counterLeft,  // Starting point of server
  counterRight, // Server next to chef
  kitchen,      // Chef
  entrance,     // Starting point of Etienne
  counterFront, // Where Etienne places order
  atTable       // Etienne waiting at a table
}

export default class ProgramState {

  constructor(initialValues: Partial<ProgramState> = {}) {
    Object.assign(this, initialValues)
  }

  public static get default() {
    return new ProgramState({
      spritePositions: {
        etienne: SpritePosition.entrance,
        server:  SpritePosition.counterLeft,
        chef:    SpritePosition.kitchen
      }
    })
  }

  public clone(): ProgramState {
    const values = cloneDeep(this)
    return new ProgramState(values)
  }

  public spritePositions!: {[key in Sprite]: SpritePosition} 

  public prepare() {
    // TODO
  }

}