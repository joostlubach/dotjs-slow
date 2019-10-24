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
      state.sprites.etienne.speak = "Ik heb goesting in 🍔"
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
    times(11, () => { this.program.modifyState(() => undefined) })
    this.program.modifyState(state => {
      state.sprites.randomDude.position = SpritePosition.entrance
    })
    this.program.modifyState(state => {
      state.sprites.randomDude.position = SpritePosition.inLine
      state.sprites.randomDude.moving = false
    })
    this.program.modifyState(state => {
      state.sprites.randomDude.position = SpritePosition.inLine
      state.sprites.randomDude.face = 'angry'
      state.sprites.randomDude.moving = false
    })
    this.program.modifyState(state => {
      state.sprites.randomDude.position = SpritePosition.inLine
      state.sprites.randomDude.face = 'angry'
      state.sprites.randomDude.moving = false
    })

    times(6, () => {
      this.program.modifyState(state => {
        state.sprites.etienne.face = 'pee'
        state.sprites.etienne.moving = false
        state.sprites.randomDude.moving = false
        state.sprites.randomDude.face = 'angry'
        state.sprites.randomDude.position = SpritePosition.inLine
      })
    })
    this.program.modifyState(state => {
      state.sprites.randomDude.moving = false
      state.sprites.randomDude.face = 'angry'
      state.sprites.randomDude.position = SpritePosition.inLine
    })
    this.program.modifyState(state => {
      state.sprites.randomDude.position = SpritePosition.inLine
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
      state.sprites.etienne.speak = "Zeg salukes he!"
    })
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "'k Heb goesting in 🍔"
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