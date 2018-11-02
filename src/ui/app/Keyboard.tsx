import * as React from 'react'
import {Character} from '@src/program'

export interface Props {
  onAction: (action: KeyAction) => any
}

const ACTIONS: {[key: number]: KeyAction} = {
  ['1'.charCodeAt(0)]: {type: 'zoom', character: 'etienne'},
  ['2'.charCodeAt(0)]: {type: 'zoom', character: 'marie'},
  ['3'.charCodeAt(0)]: {type: 'zoom', character: 'chef'},
  ['0'.charCodeAt(0)]: {type: 'zoom', character: null},
}

export type KeyAction = ZoomAction

export interface ZoomAction {
  type:      'zoom'
  character: Character | null
}

export default class Keyboard extends React.Component<Props> {

  public componentWillMount() {
    window.addEventListener('keydown', this.onKeyDown)
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const action = ACTIONS[event.keyCode]
    if (action) {
      event.preventDefault()
      this.props.onAction(action)
    }
  }

  public render() {
    return null
  }

}