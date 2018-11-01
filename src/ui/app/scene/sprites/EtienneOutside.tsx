import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'

export default function Etienne(props: SpriteProps) {
  return (
    <Sprite
      image='etienne-outside'
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