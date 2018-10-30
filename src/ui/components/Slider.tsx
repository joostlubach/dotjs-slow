import * as React from 'react'
import {jss, colors, layout, fonts, shadows} from '../styles'
import DragHandle, {DragHandleState} from 'drag-handle'

export interface Props<T> {
  values:   T[]
  value:    T
  onChange: (value: T) => void

  classNames?: React.ClassNamesProp
}

export default class Slider<T> extends React.Component<Props<T>> {

  private container: HTMLElement | null = null
  private containerRef = (el: HTMLElement | null) => { this.container = el }

  private setValueFromScreenX(x: number) {
    const {container} = this
    if (container == null) { return }

    let left = x - container.getBoundingClientRect().left
    left = Math.max(0, Math.min(container.clientWidth, left))

    const index = Math.round(left / container.clientWidth * (this.props.values.length - 1))
    const value = this.props.values[index]
    if (value === this.props.value) { return }

    this.props.onChange(value)
  }

  //------
  // Rendering

  public render() {
    const {classNames} = this.props

    return (
      <div classNames={[$.slider, classNames]} onClick={this.onClick}>
        <div classNames={$.container} ref={this.containerRef}>
          {this.renderRail()}
          {this.renderThumb()}
        </div>
      </div>
    )
  }

  private renderRail() {
    return (
      <div classNames={$.rail}/>
    )
  }

  private renderThumb() {
    const {values, value} = this.props
    const index = values.indexOf(value)
    const style = {
      left: index === -1 ? 0 : `${index * 100 / (values.length - 1)}%`
    }

    return (
      <DragHandle
        className={$.thumb}
        style={style}
        onDrag={this.onThumbDrag}
      />
    )
  }

  //------
  // Events

  private onClick = (e: React.MouseEvent<any>) => {
    this.setValueFromScreenX(e.pageX)
  }

  private onThumbDrag = (state: DragHandleState) => {
    this.setValueFromScreenX(state.mouseCurrent.x)
  }

}

const thumbSize = 24

const $ = jss({
  slider: {
    ...layout.flex.column
  },

  container: {
    position: 'relative',
    height:   thumbSize,
  },

  rail: {
    position: 'absolute',
    left:     0,
    right:    0,
    top:      '50%',

    marginTop:    -1,
    height:       2,
    borderRadius: 1,

    backgroundColor: colors.white,
  },

  thumb: {
    position: 'absolute',
    top:      0,

    width:      thumbSize,
    height:     thumbSize,
    marginLeft: -thumbSize / 2,
    borderRadius: 2,

    backgroundColor: colors.white,
    boxShadow:       shadows.control,

    transform: 'skew(-2deg)'
  }
})