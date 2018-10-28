import * as React from 'react'
import Sprite from '../Sprite'
import {jss, colors} from '@ui/styles'

export interface Props {
  x: number
  y: number
}

export default function Chef(props: Props) {
  return (
    <Sprite image='chef' size={size} animate={true} {...props} classNames={$.chef}/>
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