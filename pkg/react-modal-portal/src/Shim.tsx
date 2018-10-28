import React from 'react'
import cn from 'classnames'
import manager, {OpenPortal, ListenerDisposer} from './manager'
import ComponentTimer from 'react-component-timer'
import {omit} from 'lodash'

export interface ShimProps extends React.HTMLAttributes<any> {
  classNames?: string | string[] | any

  onWillShow?: () => any
  onDidShow?:  () => any
  onWillHide?: () => any
  onDidHide?:  () => any
}

interface ShimState {
  shown: boolean
}

export default class Shim extends React.Component<ShimProps, ShimState> {

  public state: ShimState = {
    shown: false
  }

  private disposers: Set<ListenerDisposer> = new Set()
  private timer = new ComponentTimer(this)

  private shim: HTMLDivElement | null = null
  private shimRef = (el: HTMLDivElement | null) => { this.shim = el }

  public componentDidMount() {
    this.disposers.add(manager.addListener(this.onOpenPortalsChange))
    this.disposers.add(manager.addPortalListener('willOpen', this.onPortalWillOpenOrClose))
    this.disposers.add(manager.addPortalListener('willClose', this.onPortalWillOpenOrClose))
  }

  public componentDidUpdate(prevProps: ShimProps, prevState: ShimState) {
    if (!prevState.shown && this.state.shown) {
      this.setUpMouseHandlers()
    }
    if (prevState.shown && !this.state.shown) {
      this.tearDownMouseHandlers()
    }
  }

  public componentWillUnmount() {
    this.disposers.forEach(disposer => disposer())
    if (this.state.shown) {
      this.tearDownMouseHandlers()
    }
  }

  private duration: number | null = null

  private onOpenPortalsChange = (prev: OpenPortal[], next: OpenPortal[]) => {
    const prevCount = prev.filter(p => p.showShim).length
    const nextCount = next.filter(p => p.showShim).length

    if (prevCount === 0 && nextCount > 0) {
      this.show(this.duration)
    }
    if (prevCount > 0 && nextCount === 0) {
      this.hide(this.duration)
    }
  }

  private onPortalWillOpenOrClose = (portal: OpenPortal) => {
    this.duration = portal.transitionDuration || null
  }

  public show(duration: number | null) {
    this.timer.clearAllTimeouts()
    this.onWillShow()

    if (duration == null) {
      this.setState({shown: true})
      this.onDidShow()
    } else {
      this.timer.performTransition(duration, {
        onPrepare: this.prepareTransition.bind(this, true),
        onCommit:  this.commitTransition.bind(this, true, duration),
        onCleanUp: this.cleanUpTransition.bind(this, true),
      })
    }
  }

  public hide(duration: number | null) {
    this.timer.clearAllTimeouts()
    this.onWillHide()

    if (duration == null) {
      this.setState({shown: false})
      this.onDidHide()
    } else {
      this.timer.performTransition(duration, {
        onPrepare: this.prepareTransition.bind(this, false),
        onCommit:  this.commitTransition.bind(this, false, duration),
        onCleanUp: this.cleanUpTransition.bind(this, false),
      })
    }
  }

  private onWillShow() {
    if (this.props.onWillShow) {
      this.props.onWillShow()
    }
  }

  private onDidShow() {
    if (this.props.onDidShow) {
      this.props.onDidShow()
    }
  }

  private onWillHide() {
    if (this.props.onWillHide) {
      this.props.onWillHide()
    }
  }

  private onDidHide() {
    if (this.props.onDidHide) {
      this.props.onDidHide()
    }
  }

  //------
  // Transitions

  private prepareTransition(show: boolean) {
    if (show) {
      this.setState({shown: true}, () => {
        if (this.shim) {
          this.shim.style.opacity = '0'
        }
      })
    }
  }

  private commitTransition(show: boolean, duration: number) {
    const {shim} = this
    if (shim == null) { return }

    shim.style.opacity = show ? '1' : '0'
    shim.style.transition = `opacity ${duration}ms ease-in-out`
  }

  private cleanUpTransition(show: boolean) {
    if (show) {
      if (this.shim) {
        this.shim.style.opacity = ''
        this.shim.style.transition = ''
      }
      this.onDidShow()
    } else {
      this.setState({shown: false}, () => {
        this.onDidHide()
      })
    }
  }

  private setUpMouseHandlers() {
    const {shim} = this
    if (shim == null) { return }

    shim.addEventListener('mousedown', this.onMouseDownOrTouchStart, {passive: false})
    shim.addEventListener('touchstart', this.onMouseDownOrTouchStart, {passive: false})
  }

  private tearDownMouseHandlers() {
    const {shim} = this
    if (shim == null) { return }

    shim.removeEventListener('mousedown', this.onMouseDownOrTouchStart)
    shim.removeEventListener('touchstart', this.onMouseDownOrTouchStart)
  }

  public render() {
    if (!this.state.shown) { return null }

    const {style, classNames, className, ...props} = this.props
    return (
      <div
        ref={this.shimRef}
        {...omit(props, 'onWillShow', 'onDidShow', 'onWillHide', 'onDidHide')}
        className={cn(classNames, className)}
        style={{...$.shim, ...style}}
      />
    )
  }

  private onMouseDownOrTouchStart = (event: Event) => {
    const portals = manager.openPortals.filter(portal => portal.closeOnClickShim)
    portals.forEach(portal => portal.close())

    // Unlike the document-level mouse handlers, we want to prevent anything else from happening, as the user has
    // physically tapped on the shim. For touchstart events, this is important.
    event.stopPropagation()
    event.preventDefault()
  }

}

const $: Record<string, React.CSSProperties> = {
  shim: {
    position:   'fixed',
    top:        0,
    left:       0,
    right:      0,
    bottom:     0,
  }
}