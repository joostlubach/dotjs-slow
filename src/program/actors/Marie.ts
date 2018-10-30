import Actor from '../Actor'

export default class Marie extends Actor {

  public order(condiments: string[]) {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = '🍔?'
    })
    this.program.modifyState(state => {
      state.sprites.etienne.speak = null
      state.sprites.marie.speak = '👍'
    })
  }

}