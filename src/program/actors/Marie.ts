import Actor, {Variant} from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Marie extends Actor {

  //------
  // Ordering

  public onOrder?: (what: string, condiments: string[], callback?: (order: any) => any) => any

  public orderSync(what: string, condiments: string[]) {
    this.preOrder(what, condiments, 'sync')

    let retval: any
    if (this.onOrder) {
      retval = this.onOrder(what, condiments)
    }

    this.postOrder('sync')
    return retval
  }

  public orderAsync(what: string, condiments: string[]) {
    this.preOrder(what, condiments, 'async')

    if (this.onOrder) {
      this.onOrder(what, condiments, retval => {
        this.postOrder('async')
      })
    }

    this.postOrderAsync('async')
  }

  public orderCallback(what: string, condiments: string[], callback: (order: any) => any) {
    this.preOrder(what, condiments, 'callback')

    this.checkCount = 0

    if (this.onOrder) {
      this.onOrder(what, condiments, retval => {
        this.postOrder('callback')
        callback(retval)
      })
    }

    this.postOrderAsync('callback')
  }

  public orderPromise(what: string, condiments: string[]) {
    this.preOrder(what, condiments, 'promise')

    this.checkCount = 0

    let promise: Promise<string | null> = Promise.resolve(null)
    if (this.onOrder) {
      promise = this.onOrder(what, condiments)
      promise.then(() => { this.postOrder('promise') })
    }

    this.postOrderAsync('promise')
    return promise
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
    } else if (variant === 'async') {
      // 2b. If async, just acknowledgement.
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = '👍'
      })
    } else if (variant === 'callback') {
      // 2c. If callback, Marie asks for number.
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = '👍, 📱?'
      })

      // Etienne blushes
      this.program.modifyState(state => {
        state.sprites.etienne.speak = '😊 06-ETIENNE'
        state.sprites.etienne.face = 'blush'
        state.sprites.marie.speak = null
      })

      // Marie replies
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.etienne.face = 'happy'
        state.sprites.marie.speak = '👍'
      })
    } else if (variant === 'promise') {
      this.program.modifyState(state => {
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = '👍'
      })
    }
  }

  private postOrderAsync(variant: Variant) {
    this.program.modifyState(state => {
      state.sprites.marie.flipped  = false
      state.sprites.marie.position = SpritePosition.counterLeft
      state.sprites.marie.speak    = '🕐'

      if (variant === 'promise') {
        state.sprites.marie.hold = 'pager'
      }
    })

    this.program.modifyState(state => {
      state.sprites.etienne.speak = '👍'
      state.sprites.marie.speak   = null

      if (variant === 'promise') {
        state.sprites.marie.hold = null
        state.sprites.etienne.hold = 'pager'
      }
    })
  }

  private postOrder(variant: Variant) {
    if (variant === 'sync') {
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

        state.sprites.etienne.moving = true
        state.sprites.chef.moving = false
        state.sprites.marie.moving = false  
      })
    } else if (variant === 'callback') {
      // 1b. Chef calls Etienne.
      let order: string | null
      this.program.modifyState(state => {
        order = state.sprites.marie.hold
        state.sprites.marie.hold = '📱'
      })

      // Etienne picks up
      this.program.modifyState(state => {
        state.sprites.etienne.hold = '📱'
        state.sprites.etienne.speak = '?'
      })

      // Marie says it's ready.
      this.program.modifyState(state => {
        state.sprites.etienne.hold = '📱'
        state.sprites.etienne.speak = null
        state.sprites.marie.speak = `${order}!`
      })

      // Etienne picks up.
      this.program.modifyState(state => {
        state.sprites.etienne.hold = order
        state.sprites.etienne.speak = '👍'
        state.sprites.marie.speak = null
        state.sprites.marie.hold = null
        state.sprites.etienne.position = SpritePosition.counterFront
      })

      this.program.modifyState(state => {
        state.sprites.etienne.hold = order
        state.sprites.etienne.speak = null
      })
    } else if (variant === 'promise') {
      this.program.modifyState(state => {
        state.sprites.etienne.hold = '🍔'
        state.sprites.chef.hold = null
      })

    }
  }

  //------
  // Check done

  public onCheckDone?: () => string | null

  private checkCount: number = 0

  public checkDone() {
    this.preCheckDone()

    let order: string | null = null
    if (this.onCheckDone) {
      order = this.onCheckDone()
    }

    this.postCheckDone(order)
    return order
  }

  private preCheckDone() {
    this.checkCount += 1

    // 1. Etienne asks
    this.program.modifyState(state => {
      state.sprites.etienne.position = SpritePosition.counterFront
      state.sprites.etienne.speak = `🍔?`
      // Second time, Marie is not happy.
      if (this.checkCount >= 2) {
        state.sprites.marie.face = 'angry'
      }
    })
  }

  private postCheckDone(order: string | null) {
    this.program.modifyState(state => {
      state.sprites.marie.position = SpritePosition.counterLeft
      state.sprites.marie.speak = order != null ? '✅' : '❌'
      state.sprites.marie.hold = order
      state.sprites.chef.hold = null
    })

    this.program.modifyState(state => {
      state.sprites.marie.speak = null
      if (order == null) {
        state.sprites.etienne.speak = null
        state.sprites.etienne.position = SpritePosition.atTable
        state.sprites.etienne.speak = '👎'
        state.sprites.etienne.face = 'angry'
      } else {
        state.sprites.marie.hold = null
        state.sprites.etienne.speak = '👍'
        state.sprites.etienne.hold = order
        state.sprites.etienne.face = 'happy'
      }
    })
  }

}