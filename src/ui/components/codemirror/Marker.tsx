import React from 'react'
import CodeMirror from 'codemirror'
import cn from 'classnames'
import {withCodeMirror, ContextProps} from './context'
import {isEqual} from 'lodash'

export interface Props {
  from:            CodeMirror.Position,
  to:              CodeMirror.Position,
  classNames?:     React.ClassNamesProp,
  startClassName?: React.ClassNamesProp,
  endClassName?:   React.ClassNamesProp,
  options?:        CodeMirror.TextMarkerOptions
}

type AllProps = Props & ContextProps

class Marker extends React.Component<AllProps> {

  private marker: CodeMirror.TextMarker | null = null

  private addMarker(props: Props = this.props) {
    const {codeMirror} = this.props
    if (codeMirror == null) { return }

    const {from, to, classNames, startClassName, endClassName, options} = props
    this.marker = codeMirror.getDoc().markText(from, to, {
      className:  cn(classNames),
      startStyle: startClassName == null ? undefined : cn(startClassName),
      endStyle:   endClassName == null ? undefined : cn(endClassName),
      ...options
    })
  }

  private clearMarker() {
    if (this.marker == null) { return }
    this.marker.clear()
  }

  public componentDidMount() {
    this.addMarker()
  }

  public componentWillUnmount() {
    this.clearMarker()
  }

  public componentWillReceiveProps(props: Props) {
    this.clearMarker()
    this.addMarker(props)
  }

  public shouldComponentUpdate(props: Props) {
    if (props.from.line !== this.props.from.line) { return true }
    if (props.from.ch !== this.props.from.ch) { return true }
    if (props.to.line !== this.props.to.line) { return true }
    if (props.to.ch !== this.props.to.ch) { return true }
    if (cn(props.classNames) !== cn(this.props.classNames)) { return true }
    if (!isEqual(props.options, this.props.options)) { return true }

    return false
  }

  public render() {
    return null
  }

}

export default withCodeMirror(Marker)