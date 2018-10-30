import Actor from '../Actor'
import {SpritePosition} from '../ProgramState'

export default class Chef extends Actor {

  public onRequestHamburger?: (condiments: string[], callback?: (order: any) => any) => any

  public requestHamburgerSync(condiments: string[]) {
    this.preRequestHamburger(condiments, false)

    let retval: any
    if (this.onRequestHamburger) {
      retval = this.onRequestHamburger(condiments)
    }

    this.postRequestHamburger(retval)

    return retval
  }

  public requestHamburgerAsync(condiments: string[], callback?: (order: any) => any) {
    this.preRequestHamburger(condiments, true)

    if (this.onRequestHamburger) {
      this.onRequestHamburger(condiments, hamburger => {
        this.postRequestHamburger(hamburger)
        if (callback) {
          callback(hamburger)
        }
      })
    }
  }

  private preRequestHamburger(condiments: string[], async: boolean) {
    this.program.modifyState(state => {
      state.sprites.marie.speak = null
      state.sprites.chef.speak = '👍'

      if (!async) {
        state.sprites.etienne.dance = false
        state.sprites.marie.dance = false
        state.sprites.chef.dance = true
      }
    })

    this.program.modifyState(state => {
      state.sprites.chef.speak = null
    })
  }

  private postRequestHamburger(hamburger: string) {
    this.program.modifyState(state => {
      state.sprites.chef.hold = null
      state.sprites.marie.hold = hamburger
    })
  }

  public takePatty() {
    this.program.modifyState(state => {
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

}

// function delay(secs: number) {
//   const t = Date.now()
//   while (Date.now() - t < secs * 1000) { /**/ }
// }