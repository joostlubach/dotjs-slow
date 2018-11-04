import Actor, {Variant} from '../Actor'
import {SpritePosition} from '../ProgramState'
import {times} from 'lodash'

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

    if (this.program.getState().stage === 'exterior') {
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.etienne.position = SpritePosition.outsideDoor
      })
      this.program.modifyState(state => {
        state.stage = 'interior'
        state.sprites.etienne.position = SpritePosition.entrance
        state.sprites.marie.position = SpritePosition.counterLeft
        state.sprites.chef.position = SpritePosition.kitchen
      })
    }

    if (this.onHungry) {
      this.onHungry()
    }
  }

  public hungrySync() {
    this.program.fork(this.peeFork.bind(this))
    this.hungry()
  }

  private peeFork() {
    times(20, () => { this.program.modifyState(() => undefined) })
    times(4, () => {
      this.program.modifyState(state => {
        state.sprites.etienne.face = 'pee'
      })
    })
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

  //------
  // Introduce

  public introduce() {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "Bonjour"
    })
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "J'ai faim"
    })
    this.program.modifyState(state => {
      state.stage = 'exterior'
      state.sprites.etienne.speak = null
      state.sprites.etienne.position = SpritePosition.outsideLeft
      state.sprites.marie.position = null
      state.sprites.chef.position = null
      state.prepTimesShown = false
    })
    this.program.modifyState(state => {
      state.prepTimesShown = true
    })
  }

}