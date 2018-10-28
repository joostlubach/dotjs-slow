import React from 'react'
import cn from 'classnames'
import {withCodeMirror, ContextProps} from './context'
import {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom'
import {Tappable} from '..'
import {isEqual} from 'lodash'

export interface Props {
  line:     number,
  onTap?:   () => any,
  options?: AnyObject,

  classNames?: React.ClassNamesProp,
  children?:  React.ReactNode
}

type AllProps = Props & ContextProps

class LineWidget extends React.Component<AllProps> {

  private element: HTMLElement | null = null
  private widget:  CodeMirror.LineWidget | null = null

  //------
  // Element

  private create(props: Props = this.props) {
    const {codeMirror} = this.context
    const {line, options} = props

    this.element = document.createElement('div')
    this.widget = codeMirror.addLineWidget(line, this.element, options)

    this.rerender(props)
  }

  private destroy() {
    const {element, widget} = this
    if (element == null || widget == null) { return }

    widget.clear()
    unmountComponentAtNode(element)
  }

  //------
  // Component lifecycle

  public componentDidMount() {
    this.create()
  }

  public componentWillUnmount() {
    this.destroy()
  }

  public componentWillReceiveProps(props: Props) {
    if (props.line !== this.props.line) {
      this.destroy()
      this.create(props)
    } else {
      this.rerender(props)
    }
  }

  public shouldComponentUpdate(props: Props) {
    if (props.line !== this.props.line) { return true }
    if (props.onTap !== this.props.onTap) { return true }
    if (props.children !== this.props.children) { return true }
    if (cn(props.classNames) !== cn(this.props.classNames)) { return true }
    if (!isEqual(props.options, this.props.options)) { return true }

    return false
  }

  private rerender(props: Props) {
    const {element, widget} = this
    if (element == null || widget == null) { return }

    renderSubtreeIntoContainer(this, this.renderWidget(props), element)
    try {
      widget.changed()
    } catch (_) {
      // If the line does not exist anymore, an error is thrown. This is ok as the line widget is
      // destroyed soon anyway.
    }
  }

  //------
  // Rendering

  public render() {
    return null
  }

  private renderWidget(props: Props) {
    const {classNames, onTap, children} = props
    const Component = onTap != null ? Tappable : 'div'
    const tapProps = onTap != null ? {onTap} : {}

    return (
      <Component classNames={classNames} {...tapProps}>
        {children}
      </Component>
    )
  }

}

export default withCodeMirror(LineWidget)