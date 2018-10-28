import * as React from 'react'
import {jss, layout, jssKeyframes} from '@ui/styles'
import {SVG} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  image:       SVGName
  size:        Size

  x:       number
  y:       number
  animate: boolean

  dance?: boolean
  
  classNames?: React.ClassNamesProp
}

export default class Sprite extends React.Component<Props> {

  public render() {
    const {image, size, x, y, animate, dance} = this.props
    const style: React.CSSProperties = {
      transform:         `translate(${x}px, ${y}px)`,
      transitionDuration: animate ? `${layout.durations.medium}ms` : '0ms'
    }

    return (
      <div classNames={[$.sprite, this.props.classNames]} style={style}>
        <SVG name={image} size={size} classNames={$.dance}/>
      </div>
    )
  }

}

const danceAnimation = jssKeyframes('dance', {
  '0%':   {transform: 'skew(-0, 0)', animationTimingFunction: 'ease-out'},
  '20%':  {transform: 'skew(-2deg, 0) scaleY(1.02)', animationTimingFunction: 'ease-in'},
  '50%':  {transform: 'skew(0, 0) scaleY(1)', animationTimingFunction: 'ease-out'},
  '70%':  {transform: 'skew(2deg, 0) scaleY(1.02)', animationTimingFunction: 'ease-in'},
  '100%': {transform: 'skew(0, 0)'},
})

const $ = jss({
  sprite: {
    position:   'absolute',
    top:        0,
    left:       0,
    transition: layout.transition('transform'),
    willChange: 'transform'
  },

  dance: {
    transformOrigin: '50% 100%',
    animation:       `${danceAnimation} 1.7s infinite`
  }
})