declare module 'react-sizeme' {
  import * as React from 'react'

  export interface Config {
    monitorWidth?:    boolean
    monitorHeight?:   boolean
    monitorPosition?: boolean

    refreshRate?:  number
    refreshMode?: 'throttle' | 'debounce'
    
    noPlaceholder?: boolean
  }

  export interface SizeMeProps {
    size: {
      width:    number | null
      height:   number | null
      position: Position | null
    }
  }

  export interface Position {
    left:   number
    top:    number
    right:  number
    bottom: number
  }

  interface HOC<InjectedProps> {
    <P>(Component: React.ComponentType<P & InjectedProps>): React.ComponentType<P>
  }

  function sizeMe(config?: Config): HOC<SizeMeProps>
  export default sizeMe
}