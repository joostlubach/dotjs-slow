import Actor from '../Actor'

export default class Etienne extends Actor {

  public onHungry?: () => any

  public hungry() {
    this.preHungry()

    let retval: any
    if (this.onHungry) {
      retval = this.onHungry()
    }

    this.postHungry(retval)
  }

  public eat(what: string) {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "Hmm"
      state.sprites.etienne.hold = null

      state.sprites.etienne.moving = true
      state.sprites.marie.moving = true
      state.sprites.chef.moving = true
    })
  }

  private preHungry() {
    this.program.modifyState(state => {
      state.sprites.etienne.speak = "J'ai faim"
    })
  }

  private postHungry(hamburger: string) {
    //    
  }

}