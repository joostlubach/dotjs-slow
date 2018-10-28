import * as React from 'react'
import {jss, layout, jssKeyframes} from '@ui/styles'
import {SVG} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  image:   SVGName
  size:    Size

  x:         number
  y:         number
  sceneSize: Size

  dance?: boolean
  
  classNames?: React.ClassNamesProp
}

export default class Sprite extends React.Component<Props> {

  private animateNext: boolean = false

  public componentWillReceiveProps(props: Props) {
    if (props.sceneSize.width !== this.props.sceneSize.width || props.sceneSize.height !== this.props.sceneSize.height) {
      this.animateNext = false
    } else {
      this.animateNext = true
    }
  }

  public render() {
    const {image, size, sceneSize, dance = true} = this.props

    let {x, y} = this.props
    if (x < 0) { x += sceneSize.width - size.width }
    if (y < 0) { y += sceneSize.height - size.height }

    const style: React.CSSProperties = {
      transform:         `translate(${x}px, ${y}px)`,
      transitionDuration: this.animateNext ? `${layout.durations.medium}ms` : '0ms'
    }

    return (
      <div classNames={[$.sprite, this.props.classNames]} style={style}>
        <SVG name={image} size={size} classNames={dance && $.dance}/>
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