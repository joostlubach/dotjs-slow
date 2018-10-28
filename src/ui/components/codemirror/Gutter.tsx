import * as React from 'react'

export interface Props {
  name:      string,
  children?: React.ReactNode
}

export default class Gutter extends React.Component<Props> {

  private get markers() {
    const {children} = this.props
    if (children == null) { return [] }

    return React.Children.map(children, child => {
      if (child == null) { return null }
      if (!React.isValidElement(child)) { return null }

      return React.cloneElement(child as any, {
        gutter: this.props.name
      })
    })
  }

  public render() {
    const {markers} = this
    return markers.length === 0 ? null : <div>{markers}</div>
  }

}