export type SpriteComponent = React.ComponentType<SpriteProps>

export interface SpriteProps {
  x:         number
  y:         number
  speak?:    string | null
  dance?:    boolean
  sceneSize: Size
}

// @index
export {default as MrSlow} from './MrSlow'
export {default as Etienne} from './Etienne'
export {default as Marie} from './Marie'
// /index