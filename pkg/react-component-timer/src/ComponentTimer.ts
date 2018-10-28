import {TransitionCallbacks} from './types'
import Animation from './Animation'

const FRAME = 16

export default class ComponentTimer {

  constructor(readonly component: React.Component<any>) {
    if (component) {
      this.hookUnmount(component)
    }
  }

  private readonly timeouts: Set<number> = new Set()
  private readonly animations: Set<Animation> = new Set()

  private disposed: boolean = false

  private hookUnmount(component: React.Component<any>) {
    const originalComponentWillUnmount = component.componentWillUnmount
    component.componentWillUnmount = () => {
      this.dispose()
      if (originalComponentWillUnmount) {
        originalComponentWillUnmount.call(component)
      }
    }
  }

  public dispose() {
    this.clearAllTimeouts()
    this.cancelAllAnimations()
    this.disposed = true
  }

  public setTimeout(fn: () => any, ms: number) {
    if (this.disposed) { return null }

    const timeout = window.setTimeout(() => {
      this.timeouts.delete(timeout)
      fn()
    }, ms)

    this.timeouts.add(timeout)
    return timeout
  }

  public setInterval(fn: () => any, ms: number) {
    if (this.disposed) { return null }

    const timeout = window.setInterval(fn, ms)
    this.timeouts.add(timeout)
    return timeout
  }

  public requestAnimationFrame(fn: () => any) {
    if (this.disposed) { return null }

    const timeout = window.requestAnimationFrame(() => {
      this.timeouts.delete(timeout)
      fn()
    })

    this.timeouts.add(timeout)
    return timeout
  }

  public clearTimeout(timeout: number) {
    window.clearTimeout(timeout)
    this.timeouts.delete(timeout)
  }

  public clearAllTimeouts() {
    for (const timeout of this.timeouts) {
      window.clearTimeout(timeout)
    }
    this.timeouts.clear()
  }

  //------
  // TransitionCallbackss

  public performTransition(duration: number, transition: TransitionCallbacks) {
    if (transition.onPrepare) {
      transition.onPrepare()
    }

    if (transition.onCommit) {
      this.setTimeout(transition.onCommit, FRAME)
    }

    if (transition.onCleanUp) {
      this.setTimeout(transition.onCleanUp, FRAME + duration)
    }
  }

  //------
  // Animations

  public requestAnimation(fn: (animation: Animation) => any, fps: number): Animation {
    const tStart = new Date().getTime()
    const interval = 1000 / fps
    let tPrev = tStart

    const animation = new Animation()
    const anim = animation as any as {t: number, frame: number, fps: number, handle: number}

    function loop() {
      const tNow = new Date().getTime()

      if (tNow - tPrev >= interval) {
        anim.fps = 1000 / (tNow - tPrev)
        anim.frame += 1
        anim.t = (tNow - tStart) / 1000
        fn(animation)
        tPrev = tNow
      }

      anim.handle = window.requestAnimationFrame(loop)
    }

    anim.handle = window.requestAnimationFrame(loop)

    this.animations.add(animation)
    return animation
  }

  private cancelAllAnimations() {
    for (const animation of this.animations) {
      animation.cancel()
    }
    this.animations.clear()
  }

}