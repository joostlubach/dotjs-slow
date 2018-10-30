import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors} from '@ui/styles'
import {SpritePosition, SpriteState} from '@src/program'
import * as sprites from './sprites'
import {SpriteComponent} from './sprites'
import Stove from './Stove'
import {simulatorStore} from '@src/stores'
import {SVG} from '@ui/components'
import BarStools from './BarStools'
import Tables from './Tables'
import sizeMe, {SizeMeProps} from 'react-sizeme';

export interface Props {
  classNames?: React.ClassNamesProp
}

type AllProps = Props & SizeMeProps

@observer
class Scene extends React.Component<AllProps> {

  public render() {
    return (
      <div classNames={[$.scene, this.props.classNames]}>
        {this.renderKitchen()}
        {this.renderSprite(sprites.Marie, simulatorStore.state.sprites.marie)}
        {this.renderSprite(sprites.Chef, simulatorStore.state.sprites.chef)}
        {this.renderBar()}
        {this.renderSprite(sprites.Etienne, simulatorStore.state.sprites.etienne)}
        {this.renderTables()}
      </div>
    )
  }

  private renderKitchen() {
    return (
      <div classNames={$.kitchen}>
        <Stove classNames={$.stove} panContent={simulatorStore.state.stove.panContent}/>
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

  private renderSprite(Sprite: SpriteComponent, state: SpriteState) {
    const {x, y} = wellKnownPositions[state.position]

    return (
      <Sprite
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

}

const orderHereSize = {
  width:  109,
  height: 90
}

const stoveWidth = 140

const wellKnownPositions: {[key in SpritePosition]: {x: number, y: number}} = {
  [SpritePosition.counterLeft]:  {x: 20, y: 80},
  [SpritePosition.counterRight]: {x: -280, y: 80},
  [SpritePosition.kitchen]:      {x: -150, y: 80},
  [SpritePosition.entrance]:     {x: 20, y: -20},
  [SpritePosition.counterFront]: {x: 20, y: 220},
  [SpritePosition.atTable]:      {x: 420, y: 270},
}

const $ = jss({
  scene: {
    minWidth:  640,
    minHeight: 750,

    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }
  },

  kitchen: {
    position: 'relative',
    height:   280,

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
  }
})

export default sizeMe({monitorWidth: true, monitorHeight: true})(Scene)