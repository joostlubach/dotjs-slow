import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'
import {select} from '@src/util'
import {SVGName} from '@ui/components/SVG'

export default function ChefOutside(props: SpriteProps) {
  return (
    <Sprite
      image='chef-outside'
      size={size}
      balloonOffset={{top: -40, left: 100}}
      handOffset={{top: 88, left: 66}}
      {...props}
    />
  )
}

export const size = {
  width:  128,
  height: 300
}