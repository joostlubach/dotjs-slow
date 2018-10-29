import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Restaurant extends Actor {

  public waitInLine() {
    this.state.spritePositions.etienne = SpritePosition.counterFront
  }

}