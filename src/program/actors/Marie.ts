import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

type Variant = 'sync' | 'callback'

export default class Marie extends Actor {

  public onOrder?: (what: string, condiments: string[], callback?: (order: any) => any) => any

  public orderSync(what: string, condiments: string[]) {
    this.preOrder(what, condiments, 'sync')

    let retval: any
    if (this.onOrder) {
      retval = this.onOrder(what, condiments)
    }

    this.postOrder(retval, 'sync')
    return retval
  }

  public orderCallback(what: string, condiments: string[], callback: (order: any) => any) {
    this.preOrder(what, condiments, 'callback')

    if (this.onOrder) {
      this.onOrder(what, condiments, order => {
        this.postOrder(order, 'callback')
        callback(order)
      })
    }
  }

  private preOrder(what: string, condiments: string[], variant: Variant) {
    // 1. Etienne orders
    this.program.modifyState(state => {
      if (condiments.length > 0) {
        state.sprites.etienne.speak = `${what} + [${condiments.join(', ')}]?`
      } else {
        state.sprites.etienne.speak = `${what}?`
      }
    })

    if (variant === 'sync') {
      // 2a. If sync, Marie executes order but other actors will stop moving.
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = '👍'

        state.sprites.etienne.moving = false
        state.sprites.chef.moving = false  
        state.sprites.marie.moving = true
      })

    } else if (variant === 'callback') {
      // 2b. If callback, Marie asks for number.
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = '👍, 📱?'
      })

      // Etienne blushes
      this.program.modifyState(state => {
        state.sprites.etienne.speak = '😊, pour faire quoi?'
        state.sprites.etienne.face = 'blush'
        state.sprites.marie.speak = null
      })

      // Marie replies
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.etienne.face = 'happy'
        state.sprites.marie.speak = '🍔'
      })
    }

    // 3. Marie goes to Chef.

    this.program.modifyState(state => {
      state.sprites.marie.speak = `${what} + [${condiments.join(', ')}]?`
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.flipped = true
    })
  }

  private postOrder(order: string, variant: Variant) {
    this.program.modifyState(state => {
      state.sprites.marie.flipped  = false
      state.sprites.marie.position = SpritePosition.counterLeft
      state.sprites.marie.speak    = '😊'
    })

    this.program.modifyState(state => {
      state.sprites.marie.speak = null
      state.sprites.etienne.speak = '😊'

      state.sprites.etienne.hold = state.sprites.marie.hold
      state.sprites.marie.hold = null

      if (variant === 'sync') {
        state.sprites.etienne.moving = true
        state.sprites.chef.moving = false
        state.sprites.marie.moving = false  
      }
    })
  }

}