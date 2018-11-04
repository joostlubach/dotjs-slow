import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'
import {select} from '@src/util'
import {SVGName} from '@ui/components/SVG'

export default function Etienne(props: SpriteProps) {
  const image = select<SVGName>(props.face, {
    blush:   'etienne-blush',
    angry:   'etienne-angry',
    pee:     'etienne-pee',
    default: 'etienne'
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
  width:  207,
  height: 299
}