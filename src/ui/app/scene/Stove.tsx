import * as React from 'react'
import {jss, colors} from '@ui/styles'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class Stove extends React.Component<Props> {

  public render() {
    return (
      <div classNames={[$.stove, this.props.classNames]}>
        <div classNames={$.edge}/>
      </div>
    )
  }

}

const $ = jss({
  stove: {
    background: {
      color: '#B7B7B7',
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    },

    boxShadow: [-5, 0, 20, 0, colors.shadow.alpha(0.2)]
  },

  edge: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    width:    10,
    background: colors.horizontalGradient([colors.black.alpha(0.5), colors.black.alpha(0)])
  }
})