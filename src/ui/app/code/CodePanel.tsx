import * as React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {SVG, VerticalLabel, Tappable} from '@ui/components'
import CodeEditor from './CodeEditor'
import {SVGName} from '@ui/components/SVG'
import Color from 'color'
import {Source} from '@src/program'
import {programStore} from '@src/stores'
import {SourceLocation} from 'estree'

export interface Props {
  source:    Source
  title:     string
  image:     SVGName
  tintColor: Color

  onLeftBarTap?: () => any

  classNames?: React.ClassNamesProp
}

@observer
export default class CodePanel extends React.Component<Props> {

  private getMyErrors() {
    return programStore.errors.filter(error => {
      return this.codeLocationWithinCurrentSource(error.loc)
    })
  }

  private codeLocationWithinCurrentSource(location: SourceLocation | null) {
    if (location == null) { return false }
    return location.source === this.props.source
  }

  public render() {
    return (
      <div classNames={[$.codePanel, this.props.classNames]}>
        {this.renderLeftBar()}
        {this.renderCodeEditor()}
      </div>
    )
  }

  private renderLeftBar() {
    const {image, tintColor, title, onLeftBarTap} = this.props
    const backgroundColor = tintColor.string()
    const hasErrors = this.getMyErrors().length > 0

    return (
      <Tappable classNames={$.leftBar} style={{backgroundColor}} onTap={onLeftBarTap}>
        <SVG name={image} size={{width: 32, height: 46}}/>
        <VerticalLabel classNames={$.label}>{title}</VerticalLabel>
        {hasErrors && this.renderErrorsMarker()}
      </Tappable>
    )
  }

  private renderErrorsMarker() {
    return (
      <div classNames={$.errorsMarker}/>
    )
  }

  private renderCodeEditor() {
    return (
      <CodeEditor
        source={this.props.source}
        classNames={$.codeEditor}
      />
    )
  }

}

const $ = jss({
  codePanel: {
  },

  leftBar: {
    position: 'absolute',
    top:      0,
    bottom:   0,
    left:     0,
    width:    layout.barHeight.normal,

    padding: [layout.padding.s, 0],
    ...layout.column(layout.padding.s),
    alignItems: 'center',

    background: colors.smallHorizontalBevel(),
  },

  label: {
    whiteSpace: 'nowrap'
  },

  errorsMarker: {
    width:        16,
    height:       16,
    borderRadius: 8,
    border:       [1, 'solid', colors.white],
    background:   colors.error
  },

  codeEditor: {
    ...layout.overlay,
    left:     layout.barHeight.normal,
  }
})