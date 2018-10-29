import * as React from 'react'
import * as cn from 'classnames'
import {jss, layout} from '../styles'
import DragHandle, {DragHandleState} from 'drag-handle'
import {isFunction} from 'lodash'

export interface Props {
  left?:   React.ReactNode
  right?:  React.ReactNode
  top?:    React.ReactNode
  bottom?: React.ReactNode

  main:      React.ReactNode
  splitter?: React.ReactNode | ((side: Side) => React.ReactNode)

  splitterSize:     number
  initialSizes?:    Sizes
  minimumSizes?:    Sizes
  horizontalFirst?: boolean
  onPanelResize?:   (sizes: Sizes) => void

  classNames?:         React.ClassNamesProp
  panelClassNames?:    React.ClassNamesProp | ((side: Side) => React.ClassNamesProp)
  splitterClassNames?: React.ClassNamesProp | ((side: Side) => React.ClassNamesProp)
}

export const defaults = {
  splitterSize:    8,
  horizontalFirst: true
}

export enum Side {
  left   = 'left',
  right  = 'right',
  top    = 'top',
  bottom = 'bottom'
}

export type Sizes = {
  [side in Side]?: number
}

interface State {
  sizes: Sizes
}

export default class Panels extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      sizes: {
        left:   0,
        right:  0,
        top:    0,
        bottom: 0,
        ...props.initialSizes
      }
    }
  }

  private panels: Map<Side, HTMLElement | null> = new Map()
  private panelRef = (side: Side) => (el: HTMLElement | null) => {
    if (el) {
      this.panels.set(side, el)
    } else {
      this.panels.delete(side)
    }
  }

  public render() {
    return (
      <div classNames={[$.panels, this.props.classNames]}>
        {this.renderMain()}
        {this.props.left && this.renderPanel(Side.left)}
        {this.props.right && this.renderPanel(Side.right)}
        {this.props.top && this.renderPanel(Side.top)}
        {this.props.bottom && this.renderPanel(Side.bottom)}
      </div>
    )
  }

  private renderMain() {
    const style: React.CSSProperties = {}
    for (const side of Object.keys(Side)) {
      if (this.props[side] != null) {
        style[Side[side]] = this.state.sizes[side]
      }
    }

    return (
      <div classNames={$.main} style={style}>
        {this.props.main}
      </div>
    )
  }

  private renderPanel(side: Side) {
    const {splitterSize, horizontalFirst, panelClassNames} = this.props

    const style: React.CSSProperties = {}
    if (side === Side.left || side === Side.right) {
      if (!horizontalFirst) {
        style.top = this.state.sizes.top
        style.bottom = this.state.sizes.bottom
      }
      style.width = (this.state.sizes[side] || 0) - splitterSize
    } else {
      if (horizontalFirst) {
        style.left = this.state.sizes.left
        style.right = this.state.sizes.right
      }
      style.height = (this.state.sizes[side] || 0) - splitterSize
    }

    const classNames = [
      $.panel,
      $[`panel_${side}`],
    ]
    const contentClassNames = [
      $.panelContent,
      $[`panelContent_${side}`],
      isFunction(panelClassNames) ? panelClassNames(side) : panelClassNames
    ]

    return (
      <div
        ref={this.panelRef(side)}
        classNames={classNames}
        style={style}
      >
        <div classNames={contentClassNames}>
          {this.props[side]}
        </div>
        {this.renderSplitter(side)}
      </div>
    )
  }

  private renderSplitter(side: Side) {
    const {splitter, splitterSize, splitterClassNames}  = this.props

    const style: React.CSSProperties = {}
    if (side === Side.left || side === Side.right) {
      style.width = splitterSize
      style[side === Side.left ? Side.right : Side.left] = -splitterSize
    } else {
      style.height = splitterSize
      style[side === Side.top ? Side.bottom : Side.top] = -splitterSize
    }

    const children = isFunction(splitter) ? splitter(side) : splitter
    const classNames = [
      $.splitter,
      $[`splitter_${side}`],
      isFunction(splitterClassNames) ? splitterClassNames(side) : splitterClassNames
    ]

    return (
      <DragHandle
        className={cn(classNames)}
        style={style}
        onStart={this.onDragStart.bind(this, side)}
        onEnd={this.onDragEnd}
        onDrag={this.onDrag.bind(this, side)}
        children={children}
      />
    )
  }

  //------
  // Resizing

  private startSize: number = 0

  private onDragStart = (side: Side) => {
    this.startSize = this.state.sizes[side] || 0
  }

  private onDragEnd = () => {
    this.startSize = 0

    if (this.props.onPanelResize) {
      this.props.onPanelResize(this.state.sizes)
    }
  }

  private onDrag = (side: Side, state: DragHandleState) => {
    const sizes = {...this.state.sizes}
    const delta = side === Side.left || side === Side.right ? state.mouseDelta.x : state.mouseDelta.y
    const multiplier = side === Side.left || side === Side.top ? 1 : -1

    sizes[side] = this.startSize + delta * multiplier

    const {minimumSizes} = this.props
    if (minimumSizes != null) {
      if (sizes.left != null) {
        sizes.left = minimumSizes.left == null ? sizes.left : Math.max(sizes.left, minimumSizes.left)
      }
      if (sizes.right != null) {
        sizes.right = minimumSizes.right == null ? sizes.right : Math.max(sizes.right, minimumSizes.right)
      }
      if (sizes.top != null) {
        sizes.top = minimumSizes.top == null ? sizes.top : Math.max(sizes.top, minimumSizes.top)
      }
      if (sizes.bottom != null) {
        sizes.bottom = minimumSizes.bottom == null ? sizes.bottom : Math.max(sizes.bottom, minimumSizes.bottom)
      }
    }
    
    this.setState({sizes})
  }

}

const $ = jss({
  panels: {
  },

  main: {
    ...layout.overlay
  },

  panel: {
    position: 'absolute'
  },

  panelContent: {
    ...layout.overlay,
  },

  panel_left: {
    left:   0,
    top:    0,
    bottom: 0
  },

  panel_right: {
    right:  0,
    top:    0,
    bottom: 0
  },

  panel_top: {
    left:  0,
    right: 0,
    top:   0
  },

  panel_bottom: {
    left:   0,
    right:  0,
    bottom: 0
  },

  splitter: {
    position: 'absolute',
  },

  splitter_left:   {top: 0, bottom: 0, cursor: 'ew-resize'},
  splitter_right:  {top: 0, bottom: 0, cursor: 'ew-resize'},
  splitter_top:    {left: 0, right: 0, cursor: 'ns-resize'},
  splitter_bottom: {left: 0, right: 0, cursor: 'ns-resize'}

})