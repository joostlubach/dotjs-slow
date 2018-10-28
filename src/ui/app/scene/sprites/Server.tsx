import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'
import {SpriteProps} from '.'

export default function Server(props: SpriteProps) {
  return (
    <Sprite
      image='server'
      size={size}
      classNames={$.server}
      {...props}
    />
  )
}

export const size = {
  width:  145,
  height: 222
}

const $ = jss({
  server: {
    '& svg': {
      filter: `drop-shadow(5px -5px 20px ${colors.shadow.alpha(0.4)})`
    }
  }
})