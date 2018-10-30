import * as React from 'react'
import {jss, layout, jssKeyframes, colors, shadows} from '@ui/styles'
import {SVG, Label} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  image:   SVGName
  size:    Size

  x:         number
  y:         number
  sceneSize: Size

  speak?:   string | null
  hold?:    string | null
  moving?:   boolean
  flipped?: boolean

  balloonOffset: React.CSSProperties
  handOffset:    React.CSSProperties
  
  classNames?: React.ClassNamesProp
}

export default class Sprite extends React.Component<Props> {

  private animateNext: boolean = false

  public componentWillReceiveProps(props: Props) {
    if (props.sceneSize.width !== this.props.sceneSize.width || props.sceneSize.height !== this.props.sceneSize.height) {
      this.animateNext = false
    } else {
      this.animateNext = true
    }
  }

  public render() {
    const {image, size, sceneSize, flipped, moving = true} = this.props

    let {x, y} = this.props
    if (x < 0) { x += sceneSize.width - size.width }
    if (y < 0) { y += sceneSize.height - size.height }

    const style: React.CSSProperties = {
      transform:         `translate(${x}px, ${y}px) scaleX(${flipped ? -1 : 1})`,
      transitionDuration: this.animateNext ? `${layout.durations.medium}ms` : '0ms'
    }

    return (
      <div classNames={[$.sprite, this.props.classNames]} style={style}>
        <div classNames={moving && $.moving}>
          <SVG name={image} size={size}/>
          {this.renderSpeak()}
          {this.renderHold()}
        </div>
      </div>
    )
  }

  private renderSpeak() {
    const {speak, balloonOffset, flipped} = this.props
    if (speak == null) { return null }

    const style: React.CSSProperties = {
      ...balloonOffset
    }

    const labelStyle: React.CSSProperties = {
      transform:         `scaleX(${flipped ? -1 : 1})`,
      transitionDuration: this.animateNext ? `${layout.durations.medium}ms` : '0ms',
    }

    return (
      <div classNames={$.balloon} style={style}>
        <div classNames={$.balloonBackground}/>
        <SVG classNames={$.balloonHook} name='balloon-hook' size={{width: 24, height: 16}} color={colors.white}/>
        <div style={labelStyle}>
          <Label>{speak}</Label>
        </div>
      </div>
    )
  }

  private renderHold() {
    const {hold, handOffset} = this.props
    if (hold == null) { return null }

    const style: React.CSSProperties = {
      ...handOffset
    }

    return (
      <div classNames={$.hold} style={style}>
        <Label classNames={$.holdLabel}>{hold}</Label>
      </div>
    )
  }

}

const movingAnimation = jssKeyframes('moving', {
  '0%':   {transform: 'skew(-0, 0)', animationTimingFunction: 'ease-out'},
  '20%':  {transform: 'skew(-2deg, 0) scaleY(1.02)', animationTimingFunction: 'ease-in'},
  '50%':  {transform: 'skew(0, 0) scaleY(1)', animationTimingFunction: 'ease-out'},
  '70%':  {transform: 'skew(2deg, 0) scaleY(1.02)', animationTimingFunction: 'ease-in'},
  '100%': {transform: 'skew(0, 0)'},
})

const $ = jss({
  sprite: {
    position:   'absolute',
    top:        0,
    left:       0,
    transition: layout.transition('transform'),
    willChange: 'transform'
  },

  moving: {
    transformOrigin: '50% 100%',
    animation:       `${movingAnimation} 1.7s infinite`
  },

  balloon: {
    position: 'absolute',
    boxShadow: shadows.medium(),

    ...colors.foreground(colors.black),

    padding:      layout.padding.xs,
    whiteSpace:   'nowrap',

    transition: layout.transition('transform'),
    willChange: 'transform'
  },

  balloonBackground: {
    ...layout.overlay,
    background: colors.white,
    transform:  'skew(-2deg)',
  },

  balloonHook: {
    position: 'absolute',
    bottom:   -6,
    left:     -18
  },

  hold: {
    position:   'absolute',
    height:     32
  },

  holdLabel: {
    fontFamily:  'sans-serif',
    fontSize:    28,
    lineHeight:  '32px'
  }
})