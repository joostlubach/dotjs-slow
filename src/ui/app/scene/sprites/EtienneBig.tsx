import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'

export default function Etienne(props: SpriteProps) {
  return (
    <Sprite
      image='etienne-outside'
      size={size}
      balloonOffset={{top: -60, left: 150}}
      handOffset={{top: 132, left: 99}}
      {...props}
    />
  )
}

export const size = {
  width:  311,
  height: 449
}