// @flow

import * as React from 'react'
import * as PropTypes from 'prop-types'
import {DragHandleState} from '.'

export interface Props {

  className?: string

  style?: React.CSSProperties

  children?: React.ReactNode,

  /**
   * Whether the drag handle is enabled.
   */
  enabled?: boolean

  /**
   * The threshold that needs to be dragged before dragging actually starts.
   */
  threshold?: number

  /**
   * Called when dragging starts.
   */
  onStart?: (state: DragHandleState) => void

  /**
   * Called when dragging but before the DOM is updated (in 'dom' mode).
   */
  onDrag?: (state: DragHandleState) => void

  /**
   * Called when dragging ends.
   */
  onEnd?: (state: DragHandleState) => void

}

export default class DragHandle extends React.Component<Props> {

  private get isEnabled() {
    const {enabled = true} = this.props
    return enabled
  }

  //------
  // Dragging

  private dragState: DragHandleState | null = null
  private dragActive = false

  private startDrag(pageX: number, pageY: number): boolean {
    if (!this.isEnabled) { return false }
    if (this.dragState != null) { return false }

    this.dragState = {
      mouseStart:   {x: pageX, y: pageY},
      mouseCurrent: {x: pageX, y: pageY},
      mouseDelta:   {x: 0, y: 0}
    }

    return true
  }

  private drag(pageX: number, pageY: number) {
    const {dragState} = this
    if (dragState == null) { return }

    dragState.mouseCurrent.x = pageX
    dragState.mouseCurrent.y = pageY
    dragState.mouseDelta.x = pageX - dragState.mouseStart.x
    dragState.mouseDelta.y = pageY - dragState.mouseStart.y

    if (!this.dragActive && this.isSignificantDrag(dragState)) {
      this.dragActive = true
      if (this.props.onStart) {
        this.props.onStart(dragState)
      }
    }

    if (this.dragActive && this.props.onDrag) {
      this.props.onDrag(dragState)
    }
  }

  private endDrag() {
    if (this.dragState == null) {
      return
    }

    if (this.dragActive && this.props.onEnd) {
      this.props.onEnd(this.dragState)
    }

    this.dragState = null
    this.dragActive = false
  }

  private isSignificantDrag(state: DragHandleState) {
    const {threshold} = this.props
    if (threshold == null) { return true }

    const dx = Math.abs(state.mouseDelta.x)
    const dy = Math.abs(state.mouseDelta.y)
    return dx >= threshold || dy > threshold
  }

  //------
  // Rendering

  public render() {
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onTouchStart}
        children={this.props.children}
      />
    )
  }

  //------
  // Events

  private onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const {pageX, pageY} = e.changedTouches[0]
    
    if (this.startDrag(pageX, pageY)) {
      window.addEventListener('touchmove', this.onTouchMove)
      window.addEventListener('touchend', this.onTouchEnd)
    }
  }

  private onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const {pageX, pageY} = e
    if (this.startDrag(pageX, pageY)) {
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
    }
    e.preventDefault()
  }

  private onTouchMove = (e: TouchEvent) => {
    const {pageX, pageY} = e.changedTouches[0]
    this.drag(pageX, pageY)
  }

  private onMouseMove = (e: MouseEvent) => {
    const {pageX, pageY} = e
    this.drag(pageX, pageY)
  }

  private onTouchEnd = () => {
    this.endDrag()
  }

  private onMouseUp = () => {
    this.endDrag()
  }

}