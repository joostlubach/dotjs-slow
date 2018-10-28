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
        {/* {this.renderSprite(sprites.Server, simulatorStore.state.spritePositions.server)}
        {this.renderSprite(sprites.Chef, simulatorStore.state.spritePositions.chef)} */}
      </div>
    )
  }

  private renderBar() {
    return (
      <div classNames={$.bar}>
        <div classNames={$.barSurface}/>
        {/* <SVG name='order-here' classNames={$.orderHere}/> */}
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

const $ = jss({
  scene: {
    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }
  },

  kitchenFloor: {

  }
})