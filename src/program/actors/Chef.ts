import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Chef extends Actor {

  public onRequestHamburger?: (condiments: string[]) => any

  public requestHamburger(condiments: string[]) {
    this.program.modifyState(state => {
      state.sprites.marie.speak = `🍔 + [${condiments.join(', ')}]?`
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.flipped = true
    })

    this.program.modifyState(state => {
      state.sprites.marie.speak = null
      state.sprites.chef.speak = '👍'
    })

    if (this.onRequestHamburger) {
      this.onRequestHamburger(condiments)
    }
  }

}