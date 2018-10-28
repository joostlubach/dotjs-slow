import React from 'react'
import {findDOMNode} from 'react-dom'
import {jss, shadows} from '@ui/styles'
import {closest, isInteractiveElement} from '@src/util'
import {omit} from 'lodash'
import history from '@src/history'

export interface Props extends React.HTMLAttributes<any> {
  tag?:           string
  disabled?:      boolean
  onTap?:         (event: React.SyntheticEvent<any>) => void
  onStateChange?: (state: TappableState) => void

  href?: string

  preventDefault?: boolean
  autoFocus?:      boolean
  focusable?:      boolean

  classNames?:   React.ClassNamesProp
  style?:        React.CSSProperties
  showFocus?:    boolean
  children?:     React.ReactNode
}

interface TappableState {
  focused: boolean
  hover:   boolean
  active:  boolean
}
const TappableState = {
  empty: {focused: false, hover: false, active: false}
}
export {TappableState}

interface State extends TappableState {}

export default class Tappable extends React.Component<Props, State> {

  //------
  // State

  public state: State = {
    focused: false,
    hover:   false,
    active:  false
  }

  protected updateState(state: Partial<State>) {
    const newState = {...this.state, ...state}
    this.setState(newState)
    this.reflectStateChange(newState)
  }

  private reflectStateChange(newState: State) {
    const {disabled, onStateChange} = this.props
    if (onStateChange == null) { return }

    if (disabled) {
      onStateChange({focused: false, hover: false, active: false})
    } else {
      onStateChange(newState)
    }
  }

  //------
  // Properties

  private get isExternalLink() {
    const {href} = this.props
    if (href == null) { return false }

    return /^\w+:/.test(href)
  }

  //------
  // Methods

  private isOwnTarget(event: React.SyntheticEvent<any>) {
    const closestInteractive = closest(event.target as HTMLElement, isInteractiveElement)
    return closestInteractive === event.currentTarget
  }

  public focus() {
    const element = findDOMNode(this) as HTMLElement
    if (element == null) { return }

    element.focus()
  }

  //------
  // Component lifecycle

  public componentDidMount() {
    if (this.props.autoFocus) {
      this.focus()
    }
  }

  public render() {
    const {
      tag: Component = this.props.href == null ? 'div' : 'a',
      disabled       = false,
      focusable      = true,
      showFocus      = false,

      classNames,
      style,
      children,
      ...other
    } = this.props

    return (
      <Component
        classNames={[$.tappable, !disabled && focusable && showFocus && $.showFocus, disabled && $.disabled, classNames]}
        style={style}
        role='button'
        tabIndex={(!focusable || disabled) ? -1 : 0}
        children={children}

        {...omit(other, 'onTap', 'onStateChange', 'preventDefault', 'swiper')}
        target={this.isExternalLink ? '_blank' : undefined}

        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onTouchStart={this.onTouchStart}
        onTouchCancel={this.onTouchCancel}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}

        onTouchEnd={this.onTouchEnd}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
      />
    )
  }

  //------
  // Events

  private onFocus = (e: any) => {
    if (!this.props.disabled) {
      this.updateState({focused: true})
    }
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  }

  private onBlur = (e: any) => {
    this.updateState({focused: false})
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  private onMouseEnter = (e: any) => {
    if (!this.state.hover && !this.props.disabled) {
      this.updateState({hover: true})
    }
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e)
    }
  }

  private onMouseLeave = (e: any) => {
    if (this.state.hover || this.state.active) {
      this.updateState({hover: false, active: false})
    }
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e)
    }
  }

  private onTouchStart = (e: React.TouchEvent<any>) => {
    if (this.isOwnTarget(e) && !this.props.disabled) {
      this.updateState({active: true})
    }
    if (this.props.onTouchStart) {
      this.props.onTouchStart(e)
    }
  }

  private onTouchCancel = (e: any) => {
    if (this.isOwnTarget(e)) {
      this.updateState({hover: false, active: false})
    }
    if (this.props.onTouchCancel) {
      this.props.onTouchCancel(e)
    }
  }

  private onMouseDown = (e: React.MouseEvent<any>) => {
    if (!this.props.disabled && this.isOwnTarget(e)) {
      this.updateState({active: true, hover: true})
    }

    if (this.props.onMouseDown) {
      this.props.onMouseDown(e)
    }

    if (this.isOwnTarget(e)) {
      e.preventDefault()
    }
  }

  private onMouseUp = (e: React.MouseEvent<any>) => {
    if (!this.props.disabled && this.isOwnTarget(e)) {
      this.updateState({active: false})
    }

    if (this.props.onMouseUp) {
      this.props.onMouseUp(e)
    }
  }

  //------
  // Click handling

  private onTouchEnd = (e: React.TouchEvent<any>) => {
    const ownTarget = this.isOwnTarget(e)

    if (ownTarget) {
      this.updateState({active: false})
    }

    if (this.props.onTouchEnd) {
      this.props.onTouchEnd(e)
    }

    this.performTap(e)
  }

  private onClick = (e: React.MouseEvent<any>) => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }

    // In some cases, we need to let the browser handle the click.
    this.performTap(e)
  }

  private onKeyDown = (e: React.KeyboardEvent<any>) => {
    const isSpaceOrReturn = e.which === 0x20 || e.which === 0x0D

    if (this.props.onKeyDown) {
      this.props.onKeyDown(e)
    }

    if (isSpaceOrReturn) {
      this.performTap(e)
    }
  }

  private shouldUseDefault(event: React.SyntheticEvent<any>) {
    const {href} = this.props
    if (href == null) { return false }

    if (this.isExternalLink) {
      return true
    }

    // Browsers have a default handler for cmd, alt or ctrl clicking a link.
    // We need to let the browsers take care of that and not consider this a tap.
    if ('metaKey' in event) {
      const mouseEvent = event as React.MouseEvent<any>
      if (mouseEvent.metaKey || mouseEvent.altKey || mouseEvent.ctrlKey) {
        return true
      }
    }

    return false
  }

  private performTap(event: React.SyntheticEvent<any>) {
    const {disabled, onTap} = this.props
    if (disabled || !this.isOwnTarget(event)) { return }

    if (this.shouldUseDefault(event)) { return }

    // TODO: Need to figure out. It seems that cancelable is false when some scroll action is ongoing. Instead of
    //       having <Scroller/> cancel the event, check for this. Check if it's always true that if cancelable is
    //       false, it means it's "canceled" by the browser.
    let canceled = !event.cancelable || event.isDefaultPrevented()
    if (!canceled && onTap) {
      onTap(event)
    }

    canceled = !event.cancelable || event.isDefaultPrevented()
    if (!canceled && this.props.href) {
      history.push(this.props.href)
      event.preventDefault()
    }

    if (this.props.preventDefault !== false && event.cancelable) {
      event.preventDefault()
    }
  }

}

const $ = jss({
  tappable: {
    cursor:         'pointer',
    userSelect:     'none',
    outline:        'none',
    textDecoration: 'none'
  },

  disabled: {
    cursor: 'default',
  },

  showFocus: {
    '&:focus:not(:active)': {
      boxShadow: shadows.focus
    }
  }
})