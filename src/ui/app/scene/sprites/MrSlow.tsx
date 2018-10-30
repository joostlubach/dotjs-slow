import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'
import {SpriteProps} from '.'

export default function MrSlow(props: SpriteProps) {
  return (
    <Sprite
      image='mr-slow'
      size={size}
      classNames={$.mrSlow}
      balloonOffset={{top: -30, left: 90}}
      {...props}
    />
  )
}

export const size = {
  width:  145,
  height: 184
}

const $ = jss({
  mrSlow: {
    '& svg': {
      filter: `drop-shadow(5px -5px 20px ${colors.shadow.alpha(0.4)})`
    }
  }
})