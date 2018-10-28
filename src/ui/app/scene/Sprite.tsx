import * as React from 'react'
import {jss, layout} from '@ui/styles'
import {SVG} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  image:       SVGName
  size:        Size

  x:       number
  y:       number
  animate: boolean
  
  classNames?: React.ClassNamesProp
}

export default class Sprite extends React.Component<Props> {

  public render() {
    const {image, size, x, y, animate} = this.props
    const style: React.CSSProperties = {
      transform:         `translate(${x}px, ${y}px)`,
      transitionDuration: animate ? `${layout.durations.medium}ms` : '0ms'
    }

    return (
      <div classNames={[$.sprite, this.props.classNames]} style={style}>
        <SVG name={image} size={size}/>
      </div>
    )
  }

}

const $ = jss({
  sprite: {
    position:   'absolute',
    top:        0,
    left:       0,
    transition: layout.transition('transform'),
    willChange: 'transform'
  }
})