import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'
import {SpriteProps} from '.'
import {select} from '@src/util'
import {SVGName} from '@ui/components/SVG'

export default function Marie(props: SpriteProps) {
  const image = select<SVGName>(props.face, {
    blush:   'marie-blush',
    default: 'marie'
  })

  return (
    <Sprite
      image={image}
      size={size}
      classNames={$.server}
      balloonOffset={{top: -30, left: 130}}
      handOffset={{top: 62, left: 139}}
      {...props}
    />
  )
}

export const size = {
  width:  168,
  height: 222
}

const $ = jss({
  server: {
    '& svg': {
      filter: `drop-shadow(5px -5px 20px ${colors.shadow.alpha(0.4)})`
    }
  }
})