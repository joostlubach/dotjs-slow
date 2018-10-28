export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
  x:        number
  y:        number
  animated: boolean
}

// @index
export {default as Customer} from './Customer'