import * as React from 'react'
import * as cn from 'classnames'
import {unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom'
import {withCodeMirror, ContextProps} from './context'
import {Tappable} from '@ui/components'
import {jss, layout, fonts} from '@ui/styles'

export interface Props {
  line:   number,
  onTap?: () => any,

  classNames?: React.ClassNamesProp,
  children?:   React.ReactNode
}

type AllProps = Props & ContextProps

class GutterMarker extends React.Component<AllProps> {

  private element: HTMLElement | null = null

  private get gutter(): string {
    return (this.props as any).gutter || null
  }

  //------
  // Element

  private create() {
    const {line, codeMirror} = this.props
    if (codeMirror == null) { return }

    this.element = document.createElement('div')
    codeMirror.setGutterMarker(line, this.gutter, this.element)

    this.rerender()
  }

  private destroy() {
    const {props: {codeMirror}, element} = this
    if (codeMirror == null || element == null) { return }

    codeMirror.setGutterMarker(this.props.line, this.gutter, null)
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
    const prevProps = this.props as any
    const nextProps = props as any

    if (prevProps.line !== nextProps.line || prevProps.gutter !== nextProps.gutter) {
      this.destroy()
      this.create()
    } else {
      this.rerender(props)
    }
  }

  public shouldComponentUpdate(props: AllProps) {
    if (props.line !== this.props.line) { return true }
    if (props.onTap !== this.props.onTap) { return true }
    if (props.children !== this.props.children) { return true }
    if (cn(props.classNames) !== cn(this.props.classNames)) { return true }

    return false
  }

  private rerender(props: Props = this.props) {
    const {element} = this
    if (element == null) { return }

    renderSubtreeIntoContainer(this, this.renderMarker(props), element)
  }

  //------
  // Rendering

  public render() {
    return null
  }

  private renderMarker(props: Props) {
    const {classNames, onTap, children} = props
    const Component = onTap != null ? Tappable : 'div'
    const tapProps = onTap != null ? {onTap} : {}

    return (
      <div classNames={$.gutterMarkerContainer}>
        <Component classNames={classNames} {...tapProps}>
          {children}
        </Component>
      </div>
    )
  }

}

const $ = jss({
  gutterMarkerContainer: {
    height: fonts.codeLineHeight,
    ...layout.flex.center
  }
})

export default withCodeMirror(GutterMarker)