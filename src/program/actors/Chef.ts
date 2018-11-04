import Actor, {Variant} from '../Actor'
import {SpritePosition} from '@src/program'
import Promise from '../FakePromise'

export default class Chef extends Actor {

  public onRequestHamburger?: (condiments: string[], callback?: (order: any) => any) => any

  public requestHamburgerSync(condiments: string[]) {
    this.preRequestHamburger(condiments, 'sync')

    let order: any
    if (this.onRequestHamburger) {
      order = this.onRequestHamburger(condiments)
    }

    this.postRequestHamburger('sync')
    return order
  }

  public requestHamburgerAsync(condiments: string[]) {
    this.preRequestHamburger(condiments, 'async')

    this.program.fork(() => {
      if (this.onRequestHamburger) {
        this.onRequestHamburger(condiments)
        this.postRequestHamburger('async')
      }
    })

    this.postRequestHamburgerAsync('async')
  }

  public requestHamburgerCallback(condiments: string[], callback: (order: any) => any) {
    this.preRequestHamburger(condiments, 'callback')

    this.program.fork(() => {
      if (this.onRequestHamburger) {
        this.onRequestHamburger(condiments, order => {
          this.postRequestHamburger('callback')
          callback(order)
        })
      }
    })

    this.postRequestHamburgerAsync('callback')
  }

  public requestHamburgerPromise(condiments: string[]) {
    this.preRequestHamburger(condiments, 'promise')

    const promise = new Promise(resolve => {
      this.program.fork(() => {
        if (this.onRequestHamburger) {
          this.onRequestHamburger(condiments)
            .then((order: string) => {
              this.postRequestHamburger('promise')
              resolve(order)
            })
        }
      })
    })

    this.postRequestHamburgerAsync('promise')
    return promise
  }

  private preRequestHamburger(condiments: string[], variant: Variant) {
    // 1. Marie asks for hamburger
    this.program.modifyState(state => {
      state.sprites.marie.speak = `🍔 + [${condiments.join(', ')}]?`
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.flipped = true
    })

    if (variant === 'sync') {
      // 2a. If sync, Chef executes order but other actors will stop moving.
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '👍'

        state.sprites.etienne.moving = false
        state.sprites.marie.moving = false
        state.sprites.chef.moving = true
      })
    } else if (variant === 'async') {
      // 2b. If async, just acknowledgement.
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '👍'
      })
    } else if (variant === 'callback') {
      // 2c. If callback, Chef asks for number.
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '📱?'
      })

      // Marie blushes
      this.program.modifyState(state => {
        state.sprites.marie.speak = '😊 06-MARIE'
        state.sprites.marie.face = 'blush'
        state.sprites.chef.speak = null
      })

      // Chef replies
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.marie.face = 'happy'
        state.sprites.chef.speak = '👍'
      })
    } else if (variant === 'promise') {
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '👍'
      })
    }
  }

  private postRequestHamburgerAsync(variant: Variant) {
    this.program.modifyState(state => {
      state.sprites.chef.speak = '🕐'

      if (variant === 'promise') {
        state.sprites.chef.hold = 'pager'
      }
    })

    this.program.modifyState(state => {
      state.sprites.marie.speak = '👍'
      state.sprites.chef.speak   = null

      if (variant === 'promise') {
        state.sprites.chef.hold = null
        state.sprites.marie.hold = 'pager'
      }
    })
  }

  private postRequestHamburger(variant: Variant) {
    if (variant === 'sync') {
      // 1a. Chef gives Marie the order.
      this.program.modifyState(state => {
        state.sprites.marie.hold = state.sprites.chef.hold
        state.sprites.chef.hold = null

        state.sprites.etienne.moving = false
        state.sprites.chef.moving = false
        state.sprites.marie.moving = true

        // state.latestOrder = order
      })
    } else if (variant === 'callback') {
      // 1b. Chef calls Marie.
      let order: string | null
      this.program.modifyState(state => {
        order = state.sprites.chef.hold
        state.sprites.chef.hold = '📱'
        // state.latestOrder = order
      })

      // Marie picks up
      this.program.modifyState(state => {
        state.sprites.marie.hold = '📱'
        state.sprites.marie.speak = '?'
      })

      // Chef says it's ready.
      this.program.modifyState(state => {
        state.sprites.marie.hold = '📱'
        state.sprites.marie.speak = null
        state.sprites.chef.speak = `${order}!`
      })

      // Marie picks up.
      this.program.modifyState(state => {
        state.sprites.marie.hold = order
        state.sprites.marie.speak = '👍'
        state.sprites.chef.speak = null
        state.sprites.chef.hold = null
        state.sprites.marie.position = SpritePosition.counterRight
      })

      this.program.modifyState(state => {
        state.sprites.marie.hold = order
        state.sprites.marie.speak = null
        state.sprites.marie.position = SpritePosition.counterLeft
      })
    } else if (variant === 'promise') {
      this.program.modifyState(state => {
        state.sprites.etienne.hold = 'pager-active'
      })
    }
  }

  public takePatty() {
    this.program.modifyState(state => {
      state.sprites.chef.speak = null
      state.sprites.chef.hold = '🥩'
    })
    return {type: 'patty'}
  }
  
  public takeBun() {
    this.program.modifyState(state => {
      state.sprites.chef.hold = '🍞'
    })
    return {type: 'bun'}
  }
  
  public takeCondiment(condiment: string) {
    this.program.modifyState(state => {
      state.sprites.chef.hold = condiment
    })
    return {type: 'condiment', condiment}
  }
  
  public cook(patty: any) {
    this.program.modifyState(state => {
      state.sprites.chef.hold = null
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🥩'
    })
    this.program.modifyState(state => {
      state.stove.panContent = '🍖'
    })
    this.program.modifyState(state => {
      state.stove.panContent = null
      state.sprites.chef.hold = '🍖'
    })

    return {...patty, cooked: true}
  }
  
  public makeHamburger(patty: any, bun: any, condiments: any[]) {
    this.program.modifyState(state => {
      state.sprites.chef.hold = '🍔'
    })

    return '🍔'
  }

  //------
  // Check done

  public onCheckDone?: () => string

  private checkCount: number = 0

  public checkDone() {
    this.preCheckDone()

    this.checkCount += 1

    if (this.onCheckDone) {
      this.onCheckDone()
    }

    // This is fake - as all the forks are run after the main 'thread', and there's a while loop in the main
    // thread checking for this, it would cause an infinite loop.
    if (this.checkCount === 3) {
      return '🍔'
    } else {
      return null
    }
  }

  private preCheckDone() {
    this.program.modifyState(state => {
      state.sprites.marie.position = SpritePosition.counterRight
      state.sprites.marie.speak = `🍔?`
      state.sprites.etienne.speak = null
    })
  }

  //------
  // Ending

  public callForDate() {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = '?'
      state.sprites.etienne.hold = '📱'
    })
    this.program.modifyState(state => {
      state.stage = 'interior'
      state.sprites.chef.position = SpritePosition.kitchen
      state.sprites.etienne.position = null
      state.sprites.marie.position = null
      state.sprites.chef.hold = '📱'
      state.sprites.chef.speak = '👨🏻‍🍳!'
    })
    this.program.modifyState(state => {
      state.sprites.chef.speak = '💑?'
    })
    this.program.modifyState(state => {
      state.stage = 'exterior'
      state.sprites.chef.position = null
      state.sprites.marie.position = null
      state.sprites.etienne.position = SpritePosition.outsideRight
      state.sprites.etienne.hold = '📱'
      state.sprites.etienne.speak = '🧔🏽!'
    })
    this.program.modifyState(state => {
      state.stage = 'interior'
      state.sprites.chef.position = SpritePosition.kitchen
      state.sprites.etienne.position = null
      state.sprites.marie.position = null
      state.sprites.chef.hold = '📱'
      state.sprites.chef.speak = '!'
    })
    this.program.modifyState(state => {
      state.sprites.chef.speak = '👨‍❤️‍👨?'
    })
    this.program.modifyState(state => {
      state.stage = 'exterior'
      state.sprites.chef.position = null
      state.sprites.marie.position = null
      state.sprites.etienne.position = SpritePosition.outsideRight
      state.sprites.etienne.hold = '📱'
      state.sprites.etienne.speak = '👍'
    })
    this.program.modifyState(state => {
      state.sprites.chef.position = SpritePosition.outsideDoor
      state.sprites.chef.flipped = true
      state.sprites.chef.hold = null
      state.sprites.chef.speak = null
      state.sprites.etienne.hold = null
      state.sprites.etienne.speak = null
    })
    this.program.modifyState(state => {
      state.sprites.chef.flipped = false
      state.sprites.chef.position = SpritePosition.outsideCenter
    })
    this.program.modifyState(state => {
      state.heart = 'static'
    })
    this.program.modifyState(state => {
      state.heart = 'animating'
    })
    this.program.modifyState(state => {
      state.theEnd = true
    })
  }

}