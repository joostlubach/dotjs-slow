import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'
import {SpriteProps} from '.'

export default function Chef(props: SpriteProps) {
  return (
    <Sprite
      image='chef'
      size={size}
      classNames={$.chef}
      {...props}
    />
  )
}

export const size = {
  width:  145,
  height: 184
}

const $ = jss({
  chef: {
    '& svg': {
      filter: `drop-shadow(5px -5px 20px ${colors.shadow.alpha(0.4)})`
    }
  }
})