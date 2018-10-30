export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
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
export {default as Etienne} from './Etienne'
export {default as Marie} from './Marie'
// /index