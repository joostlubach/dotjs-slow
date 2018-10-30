export type WorkerFunction<T>  = (resolve: ResolveFunction<T>, reject: RejectFunction) => any
export type ResolveFunction<T> = (value: T) => any
export type RejectFunction     = (error: Error) => any

export default class Promise<T> {

  public constructor(worker: WorkerFunction<T>) {
    worker(this.resolve, this.reject)
  }

  private resolvedValue?:  T
  private rejectionError?: Error

  private successHandlers: Array<ResolveFunction<T>> = []
  private failureHandlers: RejectFunction[] = []

  private resolve = (value: T) => {
    if (this.resolvedValue !== undefined || this.rejectionError !== undefined) {
      throw new Error("Promise already resolved / rejected")
    }
    this.resolvedValue = value
    for (const handler of this.successHandlers) {
      handler(value)
    }
  }

  private reject = (error: Error) => {
    if (this.resolvedValue !== undefined || this.rejectionError !== undefined) {
      throw new Error("Promise already resolved / rejected")
    }
    this.rejectionError = error
    for (const handler of this.failureHandlers) {
      handler(error)
    }
  }

  public then(onSuccess: ResolveFunction<T>, onFailure?: RejectFunction) {
    if (this.resolvedValue !== undefined) {
      onSuccess(this.resolvedValue)
    } else if (this.rejectionError !== undefined) {
      if (onFailure) {
        onFailure(this.rejectionError)
      }
    } else {
      this.successHandlers.push(onSuccess)
      if (onFailure) {
        this.failureHandlers.push(onFailure)
      }
    }
  }

}