export type Listener = (prev: OpenPortal[], next: OpenPortal[]) => any
export type PortalListener = (portal: OpenPortal, index: number) => any
export type ListenerDisposer = () => any

export interface PortalListeners {
  willOpen:  Set<PortalListener>
  didOpen:   Set<PortalListener>
  willClose: Set<PortalListener>
  didClose:  Set<PortalListener>
}

export interface OpenPortal {
  close: () => any

  closeOnEscape:       boolean
  shouldCloseOnClick:  ((event: Event) => boolean)
  showShim:            boolean
  closeOnClickShim:    boolean
  transitionDuration?: number | null
  containsElement?:    (element: Element) => boolean
}

export class ModalPortalManager {

  private portals: OpenPortal[] = []

  public get openPortals(): OpenPortal[] {
    return [...this.portals]
  }

  //------
  // Interface

  public addOpenPortal(portal: OpenPortal) {
    const prev = this.portals
    this.portals = [...this.portals, portal]
    this.triggerListeners(prev, this.portals)
  }

  public removeOpenPortal(portal: OpenPortal) {
    const prev = this.portals
    this.portals = this.portals.filter(p => p !== portal)
    this.triggerListeners(prev, this.portals)
  }

  public getOpenPortalCount(): number {
    return this.portals.length
  }

  public get topMostPortal(): OpenPortal | null {
    const {length} = this.portals
    if (length === 0) { return null }

    return this.portals[length - 1]
  }

  //------
  // Listeners

  private portalListeners: PortalListeners = {
    willOpen:  new Set(),
    didOpen:   new Set(),
    willClose: new Set(),
    didClose:  new Set()
  }

  public addPortalListener(event: keyof PortalListeners, listener: PortalListener): ListenerDisposer {
    this.portalListeners[event].add(listener)
    return () => {
      this.portalListeners[event].delete(listener)
    }
  }

  public triggerPortalListeners(event: keyof PortalListeners, portal: OpenPortal) {
    const index = this.openPortals.indexOf(portal)
    if (index === -1) { return }

    for (const listener of this.portalListeners[event]) {
      listener(portal, index)
    }
  }

  private countListeners: Set<Listener> = new Set()

  public addListener(listener: Listener): ListenerDisposer {
    this.countListeners.add(listener)
    return () => {
      this.countListeners.delete(listener)
    }
  }

  public triggerListeners(prev: OpenPortal[], next: OpenPortal[]) {
    for (const listener of this.countListeners) {
      listener(prev, next)
    }
  }

}

export default new ModalPortalManager()