import React from 'react'
import cn from 'classnames'
import {withCodeMirror, ContextProps} from './context'

export interface Props {
  line:        number,
  where?:      'text' | 'background' | 'gutter' | 'wrap',
  classNames?: React.ClassNamesProp
}

type AllProps = Props & ContextProps

class LineClass extends React.Component<AllProps> {

  private addLineClass() {
    const {codeMirror, line, where = 'text', classNames} = this.props
    if (codeMirror == null) { return }

    codeMirror.addLineClass(line, where, cn(classNames))
  }

  private removeLineClass() {
    const {codeMirror, line, where = 'text', classNames} = this.props
    if (codeMirror == null) { return }

    codeMirror.removeLineClass(line, where, cn(classNames))
  }

  public componentDidMount() {
    this.addLineClass()
  }

  public componentWillUnmount() {
    this.removeLineClass()
  }

  public componentDidUpdate() {
    this.removeLineClass()
    this.addLineClass()
  }

  public shouldComponentUpdate(props: Props) {
    if (props.line !== this.props.line) { return true }
    if (props.where !== this.props.where) { return true }
    if (cn(props.classNames) !== cn(this.props.classNames)) { return true }

    return false
  }

  public render() {
    return null
  }

}

export default withCodeMirror(LineClass)