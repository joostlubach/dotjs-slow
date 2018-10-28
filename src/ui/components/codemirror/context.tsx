import * as React from 'react'
import {Editor} from 'codemirror'

const {Provider, Consumer} = React.createContext<Editor | null>(null)

export interface ContextProps {
  codeMirror: Editor | null
}

const withCodeMirror: HOC<ContextProps> = (Component: any): any => {
  return (props: any) => (
    <Consumer>
      {codeMirror => <Component {...props} codeMirror={codeMirror}/>}
    </Consumer>
  )
}

export {Provider, withCodeMirror}