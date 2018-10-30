import Actor from '../Actor'
import { SpritePosition } from '../ProgramState';

export default class Marie extends Actor {

  public onOrder?: (what: string, condiments: string[], callback?: (order: any) => any) => any

  public orderSync(what: string, condiments: string[]) {
    this.preOrder(what, condiments, false)

    let retval: any
    if (this.onOrder) {
      retval = this.onOrder(what, condiments)
    }

    this.postOrder(retval, false)
    return retval
  }

  public orderAsync(what: string, condiments: string[], callback?: (order: any) => any) {
    this.preOrder(what, condiments, true)

    if (this.onOrder) {
      this.onOrder(what, condiments, order => {
        this.postOrder(order, true)
        if (callback) {
          callback(order)
        }
      })
    }
  }

  private preOrder(what: string, condiments: string[], async: boolean) {
    this.program.modifyState(state => {
      if (condiments.length > 0) {
        state.sprites.etienne.speak = `${what} + [${condiments.join(', ')}]?`
      } else {
        state.sprites.etienne.speak = `${what}?`
      }
    })

    this.program.modifyState(state => {
      state.sprites.etienne.speak = null
      state.sprites.marie.speak = '👍'

      if (!async) {
        state.sprites.etienne.moving = false
        state.sprites.chef.moving = false  
        state.sprites.marie.moving = true
      }
    })

    this.program.modifyState(state => {
      state.sprites.marie.speak = `${what} + [${condiments.join(', ')}]?`
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.flipped = true
    })
  }

  private postOrder(order: string, async: boolean) {
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

      if (!async) {
        state.sprites.etienne.moving = true
        state.sprites.chef.moving = false
        state.sprites.marie.moving = false  
      }
    })
  }

}