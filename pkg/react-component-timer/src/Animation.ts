export default class Animation {

  public readonly frame: number = -1
  public readonly t: number = 0
  public readonly fps: number = 0

  private handle: number | null = null

  public cancel() {
    if (this.handle == null) { return null }
    window.cancelAnimationFrame(this.handle)
    this.handle = null
  }

}