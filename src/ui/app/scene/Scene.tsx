import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors} from '@ui/styles'
import {SpritePosition} from '@src/program'
import * as sprites from './sprites'
import {SpriteComponent} from './sprites'
import {programStore, simulatorStore} from '@src/stores'
import {SVG} from '@ui/components'

export interface Props {
  classNames?: React.ClassNamesProp
}

@observer
export default class Scene extends React.Component<Props> {

  public state = {
    customerPosition: {x: 20, y: 20}
  }

  public render() {
    return (
      <div classNames={[$.scene, this.props.classNames]} onClick={() => { this.setState({customerPosition: {x: 20, y: 400}}) }}>
        {this.renderKitchen()}
        {this.renderBar()}
        {this.renderTables()}
        {this.renderSprite(sprites.Customer, simulatorStore.state.spritePositions.customer)}
      </div>
    )
  }

  private renderKitchen() {
    return (
      <div classNames={$.kitchen}>
        {this.renderSprite(sprites.Server, simulatorStore.state.spritePositions.server)}
        {this.renderSprite(sprites.Chef, simulatorStore.state.spritePositions.chef)}
      </div>
    )
  }

  private renderBar() {
    return (
      <div classNames={$.bar}>
        <div classNames={$.barSurface}/>
        <div classNames={$.barFront}/>
        <SVG name='order-here' size={orderHereSize} classNames={$.orderHere}/>
      </div>
    )
  }

  private renderTables() {
    return (
      <div classNames={$.tables}/>
    )
  }

  private renderSprite(Sprite: SpriteComponent, position: SpritePosition) {
    return (
      <Sprite {...position} animated={true}/>
    )
  }

}

function Kitchen() {
  return <div classNames={$.kitchenFloor}/>
}

const orderHereSize = {
  width:  109,
  height: 172
}

const $ = jss({
  scene: {
    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }
  },

  kitchen: {
    height: 280,

    background: {
      image:  'url(/images/kitchen-floor.png)',
      repeat: 'repeat',
      size:   [48, 48]
    }
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
      image:  'url(/images/bar-surface.png)',
      repeat: 'repeat',
      size:   [40, 80]
    }
  },

  barFront: {
    height: 60,
    background: {
      image:  'url(/images/bar-front.png)',
      repeat: 'repeat',
      size:   [49, 56]
    }
  },

  orderHere: {
    position: 'absolute',
    left:     180,
    top:      -135,
    ...orderHereSize
  }
})