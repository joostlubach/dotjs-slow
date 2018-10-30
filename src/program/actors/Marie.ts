import Actor from '../Actor'

export default class Marie extends Actor {

  public onOrder?: (what: string, condiments: string[]) => any

  public order(what: string, condiments: string[]) {
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
    })

    if (this.onOrder) {
      this.onOrder(what, condiments)
    }
  }

}