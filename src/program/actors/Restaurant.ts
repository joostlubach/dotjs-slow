import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Restaurant extends Actor {

  public waitInLine() {
    this.program.modifyState(state => {
      state.sprites.etienne.position = SpritePosition.counterFront
    })
    
  }

}