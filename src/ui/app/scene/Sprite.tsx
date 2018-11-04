import * as React from 'react'
import {observer} from 'mobx-react'
import {jss, layout, jssKeyframes, colors, shadows} from '@ui/styles'
import {SVG, Label} from '@ui/components'
import {SVGName} from '@ui/components/SVG'
import {musicStore} from '@src/stores'
import {TransitionGroup, CSSTransition} from 'react-transition-group'

export interface Props {
  image:   SVGName
  size:    Size

  x:         number
  y:         number
  sceneSize: Size

  spriteRef: React.Ref<HTMLDivElement>

  speak?:   string | null
  hold?:    string | null
  moving?:   boolean
  flipped?: boolean

  balloonOffset: React.CSSProperties
  handOffset:    React.CSSProperties
  
  classNames?: React.ClassNamesProp
}

@observer
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
    const currentBPM = musicStore.currentBPM
    const {image, size, sceneSize, flipped, moving = currentBPM != null} = this.props

    let {x, y} = this.props
    if (x < 0) { x += sceneSize.width - size.width }
    if (y < 0) { y += sceneSize.height - size.height }

    const style: React.CSSProperties = {
      transform:         `translate(${x}px, ${y}px) scaleX(${flipped ? -1 : 1})`,
      transitionDuration: this.animateNext ? `${layout.durations.medium}ms` : '0ms'
    }

    const movingStyle: React.CSSProperties = {
      animationDuration: currentBPM ? `${60 / (currentBPM / 2)}s` : undefined
    }

    return (
      <div ref={this.props.spriteRef} classNames={[$.sprite, this.props.classNames]} style={style}>
        <div classNames={moving && $.moving} style={movingStyle}>
          <SVG name={image} size={size}/>
          {this.renderSpeak()}
          {this.renderHold()}
        </div>
      </div>
    )
  }

  private renderSpeak() {
    const {speak, balloonOffset, flipped} = this.props

    const style: React.CSSProperties = {
      ...balloonOffset
    }

    const labelStyle: React.CSSProperties = {
      willChange:        'transform',
      transform:         `scaleX(${flipped ? -1 : 1})`,
      transitionDuration: this.animateNext ? `${layout.durations.medium}ms` : '0ms',
    }
    
    return (
      <TransitionGroup>
        {speak != null && (
          <CSSTransition key={speak} classNames={$.balloonTransition} timeout={layout.durations.short} enter exit>
            <div classNames={$.balloon} style={style}>
              <div classNames={$.balloonBackground}/>
              <SVG classNames={$.balloonHook} name='balloon-hook' size={{width: 24, height: 16}} color={colors.white}/>
              <div style={labelStyle}>
                <Label classNames={$.balloonLabel}>{speak}</Label>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
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
        {hold === 'pager' ? (
          <SVG name='pager' size={pagerSize}/>
        ) : hold === 'pager-active' ? (
          <SVG name='pager-active' size={pagerSize}/>
        ) : (
          <Label classNames={$.holdLabel}>{hold}</Label>
        )}
      </div>
    )
  }

}

const pagerSize = {
  width:  40,
  height: 40
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
    animation:       `${movingAnimation} infinite`
  },

  balloon: {
    position: 'absolute',
    boxShadow: shadows.medium(),

    ...colors.foreground(colors.black),

    padding:      layout.padding.xs,
    whiteSpace:   'nowrap',

    willChange:      ['transform', 'opacity'],
    transformOrigin: 'bottom left'
  },

  balloonLabel: {
    fontSize:   48,
  },

  balloonBackground: {
    ...layout.overlay,
    background: colors.white,
    transform:  'skew(-2deg)',
  },

  balloonHook: {
    position: 'absolute',
    bottom:   -6,
    left:     -18,
    zIndex:   2
  },

  hold: {
    position:   'absolute',
    height:     32
  },

  holdLabel: {
    fontFamily:  'sans-serif',
    fontSize:    28,
    lineHeight:  '32px'
  },

  balloonTransition: {
    '&-enter': {
      zIndex:    5,
      opacity:   0,
      transform: 'scale(0.6)'
    },

    '&-enter-active, &-exit': {
      opacity:   1,
      transform: 'scale(1)'
    },

    '&-exit-active': {
      opacity:   0,
      transform: 'scale(0.6)'
    },

    '&-enter-active, &-exit-active': {
      transition: layout.transitions.short(['opacity', 'transform'], 'cubic-bezier(0, 0.6, 0.6, 1)')
    }
  }
})