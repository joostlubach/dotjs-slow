import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout, jssKeyframes} from '@ui/styles'
import {SpritePosition, SpriteState, Character, ProgramState} from '@src/program'
import * as sprites from './sprites'
import {SpriteComponent} from './sprites'
import Stove from './Stove'
import {simulatorStore, programStore} from '@src/stores'
import {SVG, Label} from '@ui/components'
import BarStools from './BarStools'
import Tables from './Tables'
import sizeMe, {SizeMeProps} from 'react-sizeme'
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import {findDOMNode} from 'react-dom'
import Credits from './Credits'

export interface Props {
  zoom?:       Character | null
  classNames?: React.ClassNamesProp
}

type AllProps = Props & SizeMeProps

interface State {
  zoomRect:   Rect | null
  finalState: ProgramState | null
}

@observer
class Scene extends React.Component<AllProps, State> {

  public state: State = {
    zoomRect:   null,
    finalState: null
  }

  private get currentState(): ProgramState | null {
    if (this.state.finalState) {
      return this.state.finalState
    } else {
      return simulatorStore.state
    }
  }

  private sprites: Map<Character, HTMLElement> = new Map()
  private spriteRef = (character: Character) => (el: any) => {
    if (el) {
      this.sprites.set(character, findDOMNode(el))
    } else {
      this.sprites.delete(character)
    }
  }

  public componentDidMount() {
    this.zoom()
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.zoom !== this.props.zoom) {
      this.zoom()
    }
  }

  private getZoomedSprite() {
    const {zoom} = this.props
    if (zoom == null) { return null }

    const sprite = this.sprites.get(zoom)
    if (sprite == null) { return null }

    return sprite
  }

  private zoom() {
    const sprite = this.getZoomedSprite()
    if (sprite == null) {
      this.setState({zoomRect: null})
    } else {
      const {x, y} = parseTransform(sprite.style.transform || '')
      this.setState({zoomRect: {
        left:   sprite.offsetLeft + x,
        top:    sprite.offsetTop + y,
        width:  sprite.offsetWidth,
        height: sprite.offsetHeight * 2 / 3
      }})
    }
  }

  private get zoomTransform(): string | undefined {
    const {zoomRect} = this.state
    if (zoomRect == null) { return undefined }

    const width  = this.props.size.width!
    const height = this.props.size.height!

    const center = {
      x: zoomRect.left + zoomRect.width / 2,
      y: zoomRect.top + zoomRect.height / 2
    }

    const translate = {
      x: width / 2 - center.x,
      y: height / 2 - center.y
    }
    const scale = Math.min(width / zoomRect.width, height / zoomRect.height)

    return `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`
  }

  public render() {
    const state = this.currentState
    const {scenario} = programStore
    if (state == null || scenario == null) { return null }

    return (
      <TransitionGroup classNames={[$.scene, this.props.classNames]}>
        <CSSTransition key={scenario.name} timeout={layout.durations.long * 2} classNames={$.scenarioTransition} exit enter>
          <div classNames={$.sceneZoom} style={{transform: this.zoomTransform}}>
            <TransitionGroup>
              {state.stage === 'empty' && this.renderEmpty()}
              {state.stage === 'interior' && this.renderInterior()}
              {state.stage === 'exterior' && this.renderExterior()}
            </TransitionGroup>
            {this.renderHeart()}
          </div>
        </CSSTransition>
      </TransitionGroup>
    )
  }

  private renderEmpty() {
    const state = this.currentState
    if (state == null) { return null }

    return (
      <CSSTransition timeout={layout.durations.long} classNames={$.exteriorTransition} enter exit>
        <div classNames={$.empty}>
          {this.renderSprite('etienne', sprites.EtienneBig, state.sprites.etienne)}
        </div>
      </CSSTransition>
    )
  }

  private renderExterior() {
    const state = this.currentState
    if (state == null) { return null }

    return (
      <CSSTransition timeout={layout.durations.long} classNames={$.exteriorTransition} enter exit>
        <div classNames={$.exteriorContainer}>
          <div classNames={[$.exteriorBG, state.showCredits && $.exteriorBGCredits]}/>
          <div classNames={[$.exterior, state.showCredits && $.exteriorCredits]}/>
          {state.prepTimesShown && <SVG name='prep-times' size={prepTimesSize} classNames={$.prepTimes}/>}
          {this.renderSprite('chef', sprites.ChefOutside, state.sprites.chef)}
          {this.renderSprite('etienne', sprites.EtienneOutside, state.sprites.etienne)}

          <Credits classNames={[$.credits, state.showCredits && $.creditsShown]}/>
        </div>
      </CSSTransition>
    )
  }

  private renderInterior() {
    const state = this.currentState
    if (state == null) { return null }

    return (
      <CSSTransition timeout={layout.durations.long} classNames={$.interiorTransition} enter exit>
        <div classNames={$.interior}>
          {this.renderKitchen()}
          {this.renderSprite('marie', sprites.Marie, state.sprites.marie)}
          {this.renderSprite('chef', sprites.Chef, state.sprites.chef)}
          {this.renderBar()}
          {this.renderSprite('etienne', sprites.Etienne, state.sprites.etienne)}
          {this.renderSprite('randomDude', sprites.RandomDude, state.sprites.randomDude)}
          {this.renderTables()}
        </div>
      </CSSTransition>
    )
  }

  private renderKitchen() {
    const state = this.currentState
    if (state == null) { return null }

    return (
      <div classNames={$.kitchen}>
        <div classNames={$.kitchenBG}/>
        <Stove classNames={$.stove} panContent={state.stove.panContent}/>
      </div>
    )
  }

  private renderBar() {
    return (
      <div classNames={$.bar}>
        <div classNames={$.barSurface}/>
        <div classNames={$.barFront}/>
        <BarStools classNames={$.barStools}/>
        <SVG name='order-here' size={orderHereSize} classNames={$.orderHere}/>
      </div>
    )
  }

  private renderTables() {
    return (
      <Tables classNames={$.tables}/>
      )
  }

  private renderSprite(character: Character, Sprite: SpriteComponent, state: SpriteState) {
    if (state.position == null) {
      return null 
    }

    const {x, y} = wellKnownPositions[state.position]
    return (
      <Sprite
        spriteRef={this.spriteRef(character)}
        x={x}
        y={y}
        sceneSize={this.props.size as Size}
        flipped={state.flipped}
        speak={state.speak}
        hold={state.hold}
        moving={state.moving}
        face={state.face}
      />
    )
  }

  private renderHeart() {
    const state = this.currentState
    if (state == null) { return null }

    return (
      <TransitionGroup>
        {state.heart != null && (
          <CSSTransition enter timeout={layout.durations.medium} classNames={$.heartEntry} mountOnEnter>
            <div classNames={[$.heart, state.heart === 'animating' && $.heartAnim]}>
              <SVG
                classNames={state.heart === 'animating' && $.heartInnerAnim}
                name='heart'
                size={heartSize}
              />
            </div>
          </CSSTransition>
        )}
        {state.theEnd && (
          <CSSTransition timeout={layout.durations.short} classNames={$.theEndEntry} enter mountOnEnter>
            <div classNames={$.theEnd}>
              <Label>The end</Label>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    )
  }

}

const orderHereSize = {
  width:  109,
  height: 90
}

const heartSize = {
  width:  74,
  height: 65
}

const prepTimesSize = {
  width:  190,
  height: 37
}

const stoveWidth = 140

const wellKnownPositions: {[key in SpritePosition]: {x: number, y: number}} = {
  [SpritePosition.counterLeft]:  {x: 20, y: 80},
  [SpritePosition.counterRight]: {x: -280, y: 80},
  [SpritePosition.kitchen]:      {x: -150, y: 80},
  [SpritePosition.entrance]:     {x: 20, y: -20},
  [SpritePosition.counterFront]: {x: 20, y: 220},
  [SpritePosition.inLine]:       {x: 70, y: 280},
  [SpritePosition.atTable]:      {x: 420, y: 270},

  [SpritePosition.outsideDoor]:   {x: 240, y: -100},
  [SpritePosition.outsideLeft]:   {x: 120, y: -30},
  [SpritePosition.outsideCenter]: {x: 360, y: -30},
  [SpritePosition.outsideRight]:  {x: 400, y: -30},

  [SpritePosition.center]: {x: 540, y: 320}
}

const heartExit = jssKeyframes('heartExit', {
  '0%':  {
    transform: 'rotate(0deg) translate(0px) rotate(0deg)',
  },
  '50%': {
    transform: 'rotate(-180deg) translate(800px) rotate(180deg)',
  },
  '100%': {
    transform: 'rotate(-360deg) translate(200px) rotate(360deg)',
  }
})

const heartInnerExit = jssKeyframes('heartInnerExit', {
  '0%':  {
    transform: 'scale(1)',
  },
  '100%': {
    transform: 'scale(50)',
  }
})

const $ = jss({
  scene: {
    minWidth:   640,
    minHeight:  750,
    background: 'black'
  },

  sceneZoom: {
    ...layout.overlay,

    willChange: 'transform',
    transition: layout.transitions.medium('transform')
  },

  empty: {
    ...layout.overlay,
    background: {
      color: colors.sidewalkGreen,
    }
  },

  exteriorContainer: {
    ...layout.overlay,
  },
  
  exteriorBG: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    width:    1564,

    background: {
      color:    colors.skyBlue,
      repeat:   'repeat-x',
      size:     [1564, 1124],
      position: 'bottom left',
    },

    backgroundImage: `url(/images/exterior-bg.png)`,
    ...layout.retina({
      2: {backgroundImage: `url(/images/exterior-bg@2x.png)`},
    }),

    willChange: 'transform',
    transition: layout.transition('transform', 3000)
  },

  exterior: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    width:    1564,

    background: {
      repeat:   'no-repeat',
      size:     [1564, 1124],
      position: 'bottom left',
    },

    backgroundImage: `url(/images/exterior.png)`,
    ...layout.retina({
      2: {backgroundImage: `url(/images/exterior@2x.png)`},
    }),

    willChange: 'transform',
    transition: layout.transition('transform', 3000)
  },
  
  exteriorBGCredits: {
    left:      'auto',
    width:     1564 + 640,
    right:     -640,
    transform: `translateX(-640px)`
  },

  exteriorCredits: {
    left:      'auto',
    right:     0,
    transform: `translateX(-640px)`
  },

  credits: {
    position: 'absolute',
    right:    0,
    bottom:   120,
    width:    680,
    height:   500,
    
    willChange: ['opacity', 'transform'],
    transition: layout.transition(['opacity', 'transform'], 3000),
    transform:  `translateX(640px)`,
    opacity:    0
  },

  creditsShown: {
    transform: `translateX(0)`,
    opacity:    1
  },

  prepTimes: {
    position: 'absolute',
    bottom:   223,
    left:     464,
    ...prepTimesSize,
  },

  interior: {
    ...layout.overlay,

    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }
  },

  kitchen: {
    position: 'relative',
    height:   280,
    background: 'white'
  },

  kitchenBG: {
    ...layout.overlay,

    background: {
      image:    'url(/images/kitchen-floor.png)',
      repeat:   'repeat',
      position: 'center center',
      size:     [48, 48]
    }
  },

  stove: {
    position: 'absolute',
    top:      0,
    bottom:   60,
    right:    0,
    width:    stoveWidth
  },

  bar: {
    position: 'absolute',
    left:     0,
    right:    0,
    top:      220,
    height:   140,

    boxShadow: [5, -5, 20, 0, colors.shadow.alpha(0.2)]
  },

  barSurface: {
    height: 80,
    background: {
      image:    'url(/images/bar-surface.png)',
      repeat:   'repeat',
      position: 'center center',
      size:     [40, 80]
    }
  },

  barFront: {
    height: 60,
    background: {
      image:    'url(/images/bar-front.png)',
      repeat:   'repeat',
      position: 'center center',
      size:     [49, 56]
    }
  },

  barStools: {
    position: 'absolute',
    bottom:   -20,
    left:     280,
    right:    0
  },

  tables: {
    position: 'absolute',
    top:      420,
    bottom:   40,
    left:     280,
    right:    80
  },

  orderHere: {
    position: 'absolute',
    left:     180,
    top:      -orderHereSize.height / 2,
    ...orderHereSize
  },

  exteriorTransition: {
    '&-enter': {
      transform: 'scale(1.25)',
      opacity:   0,

    },

    '&-enter-active': {
      transition: layout.transitions.navigation(['transform', 'opacity'], 'cubic-bezier(0, 0.6, 0.6, 1)'),
      transform:  'scale(1)',
      opacity:    1
    },

    '&-exit': {
      transform: 'scale(1)',
      opacity:   1,
    },

    '&-exit-active': {
      transition: layout.transitions.navigation(['transform', 'opacity'], 'cubic-bezier(0, 0.6, 0.6, 1)'),
      transform:  'scale(1.25)',
      opacity:    0
    }
  },

  interiorTransition: {
    '&-enter': {
      transform: 'scale(0.8)',
      opacity:   0,

    },

    '&-enter-active': {
      transition: layout.transitions.navigation(['transform', 'opacity'], 'cubic-bezier(0, 0.6, 0.6, 1)'),
      transform:  'scale(1)',
      opacity:    1
    },

    '&-exit': {
      transform: 'scale(1)',
      opacity:   1,
    },

    '&-exit-active': {
      transition: layout.transitions.navigation(['transform', 'opacity'], 'cubic-bezier(0, 0.6, 0.6, 1)'),
      transform:  'scale(0.8)',
      opacity:    0
    }
  },

  heart: {
    position: 'absolute',
    left:     440,
    bottom:   320
  },

  heartEntry: {
    '&-enter': {
      transform: 'scale(0.2)',
      opacity:   0,

    },

    '&-enter-active': {
      transition: layout.transitions.long(['transform', 'opacity'], 'cubic-bezier(0, 2, 1, 2)'),
      transform:  'scale(1)',
      opacity:    1
    },
  },

  heartAnim: {
    animation: `${heartExit} 5s linear 1 forwards`
  },

  heartInnerAnim: {
    animation: `${heartInnerExit} 5s ease-in-out 1 forwards`
  },

  theEndEntry: {
    '&-enter': {
      opacity:   0,
    },

    '&-enter-active': {
      transition: layout.transitions.long('opacity', 'ease-in-out'),
      opacity:    1
    },
  },

  theEnd: {
    ...layout.overlay,
    ...layout.flex.center,
    fontSize: 200
  },

  zoomBox: {
    position: 'absolute',
    border: [2, 'solid', 'red']
  },

  scenarioTransition: {
    '&-enter': {
      opacity: 0,
    },

    '&-enter-active': {
      transition:      layout.transitions.long('opacity', 'ease-in-out'),
      transitionDelay: layout.durations.long,
      opacity:    1
    },

    '&-exit': {
      opacity: 1,
    },

    '&-exit-active': {
      transition: layout.transitions.long('opacity', 'ease-in-out'),
      opacity:    0
    },
  }

})

function parseTransform(transform: string): {x: number, y: number} {
  if (!/translate(?:3d)?\((.*?)\)+/.test(transform)) { return {x: 0, y: 0} }

  const args = RegExp.$1.split(', ')
  
  let x = parseFloat(args[0])
  let y = parseFloat(args[1])

  if (isNaN(x)) { x = 0 }
  if (isNaN(y)) { y = 0 }

  return {x, y}
}

export default sizeMe({monitorWidth: true, monitorHeight: true})(Scene)