import Program from './Program'
import {cloneDeep} from 'lodash'

export type Sprite = 'customer' | 'server' | 'chef'
export interface SpritePosition {
  x: number
  y: number
}

export default class ProgramState {

  constructor(initialValues: Partial<ProgramState> = {}) {
    Object.assign(this, initialValues)
  }

  public static get default() {
    return new ProgramState({
      spritePositions: {
        customer: {x: 20, y: 600},
        server:   {x: 20, y: 100},
        chef:     {x: 480, y: 100}
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