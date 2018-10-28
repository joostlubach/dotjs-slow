import * as React from 'react'
import {jss, colors, layout} from '@ui/styles'
import * as sprites from './sprites'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class Scene extends React.Component<Props> {

  public state = {
    customerPosition: {x: 0, y: 0}
  }

  public render() {
    return (
      <div classNames={[$.scene, this.props.classNames]} onClick={() => { this.setState({customerPosition: {x: 20, y: 400}}) }}>
        {this.renderCustomer()}
      </div>
    )
  }

  private renderCustomer() {
    return (
      <sprites.Customer {...this.state.customerPosition}/>
    )
  }

}

const $ = jss({
  scene: {
    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }
  }
})