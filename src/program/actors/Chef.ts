import Actor from '../Actor'

type Variant = 'sync' | 'callback'

export default class Chef extends Actor {

  public onRequestHamburger?: (condiments: string[], callback?: (order: any) => any) => any

  public requestHamburgerSync(condiments: string[]) {
    this.preRequestHamburger(condiments, 'sync')

    let retval: any
    if (this.onRequestHamburger) {
      retval = this.onRequestHamburger(condiments)
    }

    this.postRequestHamburger(retval, 'sync')

    return retval
  }

  public requestHamburgerCallback(condiments: string[], callback: (order: any) => any) {
    this.preRequestHamburger(condiments, 'callback')

    if (this.onRequestHamburger) {
      this.onRequestHamburger(condiments, hamburger => {
        this.postRequestHamburger(hamburger, 'callback')
        callback(hamburger)
      })
    }
  }

  private preRequestHamburger(condiments: string[], variant: Variant) {
    if (variant === 'sync') {
      // 2a. If sync, Chef executes order but other actors will stop moving.
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '👍'

        state.sprites.etienne.moving = false
        state.sprites.marie.moving = false
        state.sprites.chef.moving = true
      })
    } else if (variant === 'callback') {
      // 2b. If callback, Chef asks for number.
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.chef.speak = '📱?'
      })

      // Marie blushes
      this.program.modifyState(state => {
        state.sprites.marie.speak = '😊 06-87654321'
        state.sprites.marie.face = 'blush'
        state.sprites.chef.speak = null
      })

      // Chef replies
      this.program.modifyState(state => {
        state.sprites.marie.speak = null
        state.sprites.marie.face = 'happy'
        state.sprites.chef.speak = '👍'
      })
    }
  }

  private postRequestHamburger(hamburger: string, variant: Variant) {
    this.program.modifyState(state => {
      state.sprites.marie.hold = state.sprites.chef.hold
      state.sprites.chef.hold = null

      if (variant === 'sync') {
        state.sprites.etienne.moving = false
        state.sprites.chef.moving = false
        state.sprites.marie.moving = true  
      }
    })
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
      state.sprites.chef.speak = null
      state.sprites.chef.hold = '🍞'
    })
    return {type: 'bun'}
  }
  
  public takeCondiment(condiment: string) {
    this.program.modifyState(state => {
      state.sprites.chef.speak = null
      state.sprites.chef.hold = condiment
    })
    return {type: 'condiment', condiment}
  }
  
  public cook(patty: any) {
    this.program.modifyState(state => {
      state.sprites.chef.speak = null
      state.sprites.chef.hold = null
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
      state.sprites.chef.speak = null
      state.sprites.chef.hold = '🍔'
    })

    return '🍔'
  }

}

// function delay(secs: number) {
//   const t = Date.now()
//   while (Date.now() - t < secs * 1000) { /**/ }
// }