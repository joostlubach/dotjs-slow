export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
  x:         number
  y:         number
  animated:  boolean
  sceneSize: Size
}

// @index
export {default as Chef} from './Chef'
export {default as Etienne} from './Etienne'
export {default as Server} from './Server'
// /index