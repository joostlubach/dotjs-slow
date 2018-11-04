import React from 'react'

export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
  spriteRef: React.Ref<HTMLDivElement>
  x:         number
  y:         number
  speak?:    string | null
  hold?:     string | null
  flipped?:  boolean
  moving?:   boolean
  face:      string
  sceneSize: Size
}

// @index
export {default as Chef} from './Chef'
export {default as ChefOutside} from './ChefOutside'
export {default as Etienne} from './Etienne'
export {default as EtienneBig} from './EtienneBig'
export {default as EtienneOutside} from './EtienneOutside'
export {default as Marie} from './Marie'
export {default as RandomDude} from './RandomDude'
// /index