import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import manager, {OpenPortal} from './manager'
import ComponentTimer from 'react-component-timer'
import './ModalPortal.css'

export interface Props {
  isOpen:          boolean
  onRequestClose?: () => any

  onWillOpen?:  () => any
  onDidOpen?:   () => any
  onWillClose?: () => any
  onDidClose?:  () => any

  containerSelector?:   string

  closeOnEscape?:       boolean
  closeOnClickOutside?: boolean
  shouldCloseOnClick?:  (event: Event) => boolean | undefined
  showShim?:            boolean

  captureFocus?:      boolean
  autoFocusFirst?:    boolean

  transitionName?:      string
  transitionDuration?:  number
  onPrepareTransition?: (open: boolean) => any
  onCommitTransition?:  (open: boolean, duration: number) => any
  onCleanUpTransition?: (open: boolean) => any

  classNames?: string | string[] | any
  style?:      React.CSSProperties
  children?:   React.ReactNode
}

interface State {
  visible:     boolean
  hideContent: boolean
}

export default class ModalPortal extends React.Component<Props, State> implements OpenPortal {

  public state: State = {
    visible:     false,
    hideContent: false
  }

  private portal: HTMLElement | null = null
  private portalRef = (el: HTMLElement | null) => { this.portal = el }

  private root = document.createElement('div')

  public static appElement: HTMLElement | null = null
  public static zIndex: number = 1000

  private timer = new ComponentTimer(this)

  //------
  // Component lifecycle

  public componentDidMount() {
    const container = document.querySelector(this.props.containerSelector || 'body')
    if (container) {
      container.appendChild(this.root)
    }

    if (this.props.isOpen) {
      this.performOpen(true)
    }
  }

  public componentWillUnmount() {
    if (this.props.isOpen) {
      this.performClose(false)
    }

    const container = this.root.parentElement
    if (container) {
      container.removeChild(this.root)
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.performOpen()
    }
    if (prevProps.isOpen && !this.props.isOpen) {
      this.performClose()
    }

    if (this.props.isOpen) {
      this.setContentClassName()
    }
  }

  private setContentClassName() {
    if (this.portal == null) { return }

    for (const child of Array.from(this.portal.children)) {
      if (child instanceof Element) {
        child.classList.add('ModalPortalContent')
      }
    }
  }

  //------
  // OpenPortal interface

  public close() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose()
    }
  }

  public get closeOnEscape() {
    return this.props.closeOnEscape !== false
  }

  public shouldCloseOnClick(event: Event) {
    if (this.props.shouldCloseOnClick) {
      const shouldClose = this.props.shouldCloseOnClick(event)
      if (shouldClose !== undefined) { return shouldClose }
    }

    if (this.props.closeOnClickOutside && this.portal != null) {
      return !this.portal.contains(event.target as Node)
    } else {
      return false
    }
  }

  public get showShim() {
    return this.props.showShim !== false
  }

  public get closeOnClickShim() {
    return this.props.closeOnClickOutside !== false
  }

  public get transitionDuration() {
    return this.props.transitionDuration
  }

  public containsElement(element: Element) {
    if (this.portal == null) { return false }
    return this.portal.contains(element)
  }

  //------
  // Open / close

  private performOpen(useTransitions: boolean = true) {
    this.timer.clearAllTimeouts()

    this.onWillOpen()

    if (useTransitions && this.props.transitionDuration != null) {
      // Hide the content first (using visibility=hidden), allowing any prepare transition handler to
      // measure the contents.
      this.setState({visible: true, hideContent: true}, () => {
        this.transitionOpen()
      })
    } else {
      this.setState({visible: true, hideContent: false}, () => {
        this.setInitialFocus()
        this.captureFocus()
        this.finishOpen()
      })
    }
  }

  private finishOpen() {
    this.onDidOpen()
  }

  private performClose(useTransitions: boolean = true) {
    this.releaseFocus()

    this.timer.clearAllTimeouts()
    this.onWillClose()

    if (useTransitions && this.props.transitionDuration != null) {
      this.transitionClose()
    } else {
      this.finishClose(useTransitions)
    }
  }

  private finishClose(defer: boolean) {
    if (defer) {
      this.setState({visible: false}, () => {
        this.onDidClose()
      })
    } else {
      this.onDidClose()
    }
  }

  private onWillOpen() {
    if (this.props.onWillOpen) {
      this.props.onWillOpen()
    }

    manager.triggerPortalListeners('willOpen', this)
    manager.addOpenPortal(this)
  }

  private onDidOpen() {
    if (this.props.onDidOpen) {
      this.props.onDidOpen()
    }

    manager.triggerPortalListeners('didOpen', this)
  }

  private onWillClose() {
    if (this.props.onWillClose) {
      this.props.onWillClose()
    }

    manager.triggerPortalListeners('willClose', this)
    manager.removeOpenPortal(this)
  }

  private onDidClose() {
    if (this.props.onDidClose) {
      this.props.onDidClose()
    }

    manager.triggerPortalListeners('didClose', this)
  }

  //------
  // Custom transitions

  private transitionOpen() {
    const {transitionDuration} = this.props
    if (transitionDuration == null) { return }

    this.timer.performTransition(transitionDuration, {
      onPrepare: () => {
        this.removeTransitionClassNames('open', 'open-active')
        this.appendTransitionClassNames('open')
        if (this.props.onPrepareTransition) {
          this.props.onPrepareTransition(true)
        }

        this.setState({hideContent: false}, () => {
          this.setInitialFocus()
          this.captureFocus()
        })
      },

      onCommit: () => {
        this.appendTransitionClassNames('open-active')
        if (this.props.onCommitTransition) {
          this.props.onCommitTransition(true, transitionDuration)
        }
      },

      onCleanUp: () => {
        this.removeTransitionClassNames('open', 'open-active')
        if (this.props.onCleanUpTransition) {
          this.props.onCleanUpTransition(true)
        }

        this.finishOpen()
      }
    })
  }

  private transitionClose() {
    const {transitionDuration} = this.props
    if (transitionDuration == null) { return }

    this.timer.performTransition(transitionDuration, {
      onPrepare: () => {
        this.removeTransitionClassNames('close', 'close-active')
        this.appendTransitionClassNames('close')
        if (this.props.onPrepareTransition) {
          this.props.onPrepareTransition(false)
        }
      },

      onCommit: () => {
        this.appendTransitionClassNames('close-active')
        if (this.props.onCommitTransition) {
          this.props.onCommitTransition(false, transitionDuration)
        }
      },

      onCleanUp: () => {
        this.removeTransitionClassNames('close', 'close-active')
        if (this.props.onCleanUpTransition) {
          this.props.onCleanUpTransition(false)
        }

        this.finishClose(true)
      }
    })
  }

  private get transitionElements(): HTMLElement[] {
    if (this.portal == null) { return [] }
    return Array
      .from(this.portal.children)
      .filter(el => el instanceof HTMLElement) as HTMLElement[]
  }

  private transitionClassNames(suffixes: string[]) {
    const {transitionName} = this.props
    if (transitionName == null) { return [] }

    return suffixes.map(suffix => `${transitionName}-${suffix}`)
  }

  private appendTransitionClassNames(...suffixes: string[]) {
    const classNames = this.transitionClassNames(suffixes)
    if (classNames.length === 0) { return }

    for (const element of this.transitionElements) {
      element.classList.add(...classNames)
    }
  }

  private removeTransitionClassNames(...suffixes: string[]) {
    const classNames = this.transitionClassNames(suffixes)
    if (classNames.length === 0) { return }

    for (const element of this.transitionElements) {
      element.classList.remove(...classNames)
    }
  }

  //------
  // Focus handling

  private setInitialFocus() {
    if (this.props.autoFocusFirst !== false) {
      const firstFocusable = this.root.querySelector(FOCUSABLE) as HTMLElement | null
      if (firstFocusable) {
        firstFocusable.focus()
      }
    } else if (this.props.captureFocus !== false && this.portal) {
      this.portal.focus()
    }
  }

  private storedTabIndexes: Map<Element, string | null> = new Map()

  private captureFocus() {
    if (this.portal == null) { return }
    if (this.props.captureFocus === false) { return }

    this.storedTabIndexes.clear()

    const allFocusable = document.querySelectorAll(FOCUSABLE)

    // tslint:disable-next-line prefer-for-of
    for (let i = 0; i < allFocusable.length; i++) {
      const element = allFocusable[i]
      if (this.portal.contains(element)) { continue }

      this.storedTabIndexes.set(element, element.getAttribute('tabindex'))
      element.setAttribute('tabindex', '-1')
    }
  }

  private releaseFocus() {
    for (const [element, tabIndex] of this.storedTabIndexes) {
      if (tabIndex == null) {
        element.removeAttribute('tabindex')
      } else {
        element.setAttribute('tabindex', tabIndex)
      }
    }
    this.storedTabIndexes.clear()
  }

  //------
  // Rendering

  public render() {
    const {visible} = this.state
    if (!visible) { return null }

    return ReactDOM.createPortal(
      this.renderPortal(),
      this.root
    )
  }

  private renderPortal() {
    const {classNames, children} = this.props
    const {hideContent} = this.state

    const style: React.CSSProperties = {
      ...this.props.style,
      zIndex: ModalPortal.zIndex,
    }
    if (hideContent) {
      style.visibility = 'hidden'
    }

    return (
      <div
        ref={this.portalRef}
        style={style}
        className={cn('ModalPortal', classNames)}
        tabIndex={0}
        children={children}
      />
    )
  }

}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'