import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'
import {select} from '@src/util'
import {SVGName} from '@ui/components/SVG'

export default function RandomDude(props: SpriteProps) {
  const image = select<SVGName>(props.face, {
    angry:   'random-dude-angry',
    default: 'random-dude'
  })

  return (
    <Sprite
      image={image}
      size={size}
      balloonOffset={{top: -40, left: 100}}
      handOffset={{top: 88, left: 66}}
      {...props}
    />
  )
}

export const size = {
  width:  135,
  height: 322
}