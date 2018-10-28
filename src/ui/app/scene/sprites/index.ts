export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
  x:        number
  y:        number
  animated: boolean
}

// @index
export {default as Chef} from './Chef'
export {default as Customer} from './Customer'
export {default as Server} from './Server'
// /index