import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Chef extends Actor {

  public onRequestHamburger?: (condiments: string[]) => any

  public requestHamburger() {
    this.program.modifyState(state => {
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.flipped = true
    })
  }

}