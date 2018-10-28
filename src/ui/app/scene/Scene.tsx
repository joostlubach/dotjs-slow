import * as React from 'react'
import {jss, colors, layout} from '@ui/styles'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class Scene extends React.Component<Props> {

  public render() {
    return (
      <div classNames={[$.scene, this.props.classNames]}>
        Scene
      </div>
    )
  }

}

const $ = jss({
  scene: {
    ...layout.flex.center,

    background: {
      color: colors.lightBlue,
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    }

  }
})