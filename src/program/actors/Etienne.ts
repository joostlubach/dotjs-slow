import Actor, {Variant} from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Etienne extends Actor {

  //------
  // Hooks

  public onHungry?: () => any

  //------
  // Hungry

  public hungry() {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "J'ai faim"
    })

    if (this.onHungry) {
      this.onHungry()
    }
  }

  //------
  // Wait at table

  public waitAtTable() {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = null
      state.sprites.etienne.position = SpritePosition.atTable
    })
  }

  //------
  // Eat

  public eat(what: string) {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "Hmm"
      state.sprites.etienne.hold = null
      state.sprites.etienne.face = 'happy'

      state.sprites.etienne.moving = true
      state.sprites.marie.moving = true
      state.sprites.chef.moving = true
    })
  }

}