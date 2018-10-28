export interface Options {
  timeout?: number
}

export default class Semaphore {

  constructor(public readonly options: Options = {}) {
    this.reset()
  }

  private timeoutTimer: number | null = null
  private promise!:     Promise<boolean>
  private resolver!:    (completed: boolean) => any
  private rejecter!:    (error: Error) => any

  public clear() {
    this.promise = new Promise((resolve, reject) => {
      this.resolver = resolve
      this.rejecter = reject
    })
    if (this.timeoutTimer) {
      window.clearTimeout(this.timeoutTimer)
      this.timeoutTimer = null
    }
  }

  public reset() {
    this.clear()

    if (this.options.timeout != null) {
      this.timeoutTimer = window.setTimeout(this.onTimeout, this.options.timeout)
    }
  }

  public signal() {
    this.resolve(true)
  }

  private onTimeout = () => {
    this.resolve(false)
  }

  private resolve(result: boolean) {
    this.resolver(result)
  }

  // Promise interface

  public then(resolve: (completed: boolean) => any, reject?: (error: Error) => any) {
    this.promise.then(resolve, reject)
  }

}