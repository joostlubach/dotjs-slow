import * as React from 'react'
import {jss, colors, layout} from '@ui/styles'
import {SVG, VerticalLabel} from '@ui/components'
import {SVGName} from '@ui/components/SVG'
import Color from 'color'

export interface Props {
  title:     string
  image:     SVGName
  tintColor: Color

  classNames?: React.ClassNamesProp
}

export default class CodePanel extends React.Component<Props> {

  public render() {
    return (
      <div classNames={[$.codePanel, this.props.classNames]}>
        {this.renderLeftBar()}
        {this.renderBody()}
      </div>
    )
  }

  private renderLeftBar() {
    const {image, tintColor, title} = this.props
    const backgroundColor = tintColor.string()

    return (
      <div classNames={$.leftBar} style={{backgroundColor}}>
        <SVG name={image} size={{width: 32, height: 46}}/>
        <VerticalLabel classNames={$.label}>{title}</VerticalLabel>
      </div>
    )
  }

  private renderBody() {
    return (
      <div classNames={$.body}>
        Code
      </div>
    )
  }

}

const $ = jss({
  codePanel: {
    ...layout.flex.row
  },

  leftBar: {
    padding: [layout.padding.s, 0],
    ...layout.column(layout.padding.s),
    alignItems: 'center',

    background: colors.smallHorizontalBevel(),
    width:      layout.barHeight.normal
  },

  body: {
    flex: [1, 0, 0],
    ...layout.flex.center
  }
})