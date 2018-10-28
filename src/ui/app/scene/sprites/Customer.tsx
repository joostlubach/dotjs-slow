import * as React from 'react'
import Sprite from '../Sprite'

export interface Props {
  x: number
  y: number
}

export default function Customer(props: Props) {
  return (
    <Sprite image='customer' size={size} animate={true} {...props}/>
  )
}

export const size = {
  width:  207,
  height: 299
}