import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'

export interface Props {
  x: number
  y: number
}

export default function Server(props: Props) {
  return (
    <Sprite image='server' size={size} animate={true} {...props} classNames={$.server}/>
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