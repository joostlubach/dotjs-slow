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
  children?:   React.ReactNode
}

type AllProps = Props & ContextProps

class LineWidget extends React.Component<AllProps> {

  private element: HTMLElement | null = null
  private widget:  CodeMirror.LineWidget | null = null

  //------
  // Element

  private create() {
    const {codeMirror, line, options} = this.props
    if (codeMirror == null) { return }
    
    this.element = document.createElement('div')
    this.widget = codeMirror.addLineWidget(line, this.element, options)

    this.rerender()
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

  public componentDidUpdate(prevProps: Props) {
    if (this.props.line !== prevProps.line) {
      this.destroy()
      this.create()
    } else {
      this.rerender()
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

  private rerender() {
    const {element, widget} = this
    if (element == null || widget == null) { return }

    renderSubtreeIntoContainer(this, this.renderWidget(), element)
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

  private renderWidget() {
    const {classNames, onTap, children} = this.props
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