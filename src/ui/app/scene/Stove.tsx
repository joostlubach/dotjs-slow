import * as React from 'react'
import {jss, colors, layout} from '@ui/styles'
import {SVG, Label} from '@ui/components'

export interface Props {
  panContent?: string | null
  classNames?: React.ClassNamesProp
}

export default class Stove extends React.Component<Props> {

  public render() {
    const {panContent} = this.props

    return (
      <div classNames={[$.stove, this.props.classNames]}>
        <div classNames={$.edge}/>
        <div classNames={$.hob}>
          <SVG name='hob' size={hobSize}/>
        </div>
        <div classNames={$.hob}>
          <SVG name='hob' size={hobSize}/>
        </div>
        <div classNames={$.hob}>
          <SVG name='hob' size={hobSize}/>
          {this.renderPan()}
        </div>
      </div>
    )
  }

  private renderPan() {
    const {panContent} = this.props
    if (panContent == null) { return null }

    return (
      <div classNames={$.pan}>
        <SVG name='pan' size={panSize}/>
        <Label classNames={$.panLabel}>{panContent}</Label>
      </div>
    )
  }

}

const hobSize = {
  width: 74,
  height: 55
}

const panSize = {
  width: 116,
  height: 68
}

const $ = jss({
  stove: {
    background: {
      color: '#B7B7B7',
      image: colors.spotlightGradient([colors.white.alpha(0.5), colors.white.alpha(0)])
    },

    ...layout.flex.column,
    alignItems:     'center',
    justifyContent: 'space-around',

    boxShadow: [-5, 0, 20, 0, colors.shadow.alpha(0.2)]
  },

  edge: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    width:    10,
    background: colors.horizontalGradient([colors.black.alpha(0.5), colors.black.alpha(0)])
  },

  hob: {
    position: 'relative',
    ...hobSize
  },

  pan: {
    position: 'absolute',
    top:      -16,
    left:     -35,

    ...panSize,
  },

  panLabel: {
    position: 'absolute',
    top:      24,
    left:     58,

    fontFamily:  'sans-serif',
    fontSize:    28,
    lineHeight:  '32px'
  }
  
})