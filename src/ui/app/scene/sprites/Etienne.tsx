import * as React from 'react'
import Sprite from '../Sprite'
import {SpriteProps} from '.'

export default function Etienne(props: SpriteProps) {
  return (
    <Sprite
      image='etienne'
      size={size}
      {...props}
    />
  )
}

export const size = {
  width:  207,
  height: 299
}