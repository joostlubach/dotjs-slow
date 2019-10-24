import * as React from 'react'
import {Character} from '@src/program'
import scenarios from '@src/scenarios'

export interface Props {
  onAction: (action: KeyAction) => any
}

const ACTIONS: {[key: number]: KeyAction} = {
  ['1'.charCodeAt(0)]: {type: 'zoom', character: 'etienne'},
  ['2'.charCodeAt(0)]: {type: 'zoom', character: 'marie'},
  ['3'.charCodeAt(0)]: {type: 'zoom', character: 'chef'},
  ['4'.charCodeAt(0)]: {type: 'zoom', character: 'randomDude'},
  ['0'.charCodeAt(0)]: {type: 'zoom', character: null},

  [32]: {type: 'next'},
  ['P'.charCodeAt(0)]: {type: 'previous'},

  [33]: {type: 'previous'},
  [34]: {type: 'next'},

  [37]: {type: 'simulator', action: 'backward'},
  [39]: {type: 'simulator', action: 'forward'},
  [38]: {type: 'simulator', action: 'reset'},
  [40]: {type: 'simulator', action: 'playPause'},

  ['Z'.charCodeAt(0)]: {type: 'loadScenario', 'scenario': 'introduction'},
  ['X'.charCodeAt(0)]: {type: 'loadScenario', 'scenario': 'synchronous'},
  ['C'.charCodeAt(0)]: {type: 'loadScenario', 'scenario': 'callback'},
  ['V'.charCodeAt(0)]: {type: 'loadScenario', 'scenario': 'promise'},
  ['B'.charCodeAt(0)]: {type: 'loadScenario', 'scenario': 'ending'},
}

export type KeyAction = PreviousAction | NextAction | ZoomAction | SimulatorAction | LoadScenarioAction

export interface PreviousAction {
  type: 'previous'
}

export interface NextAction {
  type: 'next'
}

export interface ZoomAction {
  type:      'zoom'
  character: Character | null
}

export interface SimulatorAction {
  type:   'simulator'
  action: 'playPause' | 'forward' | 'backward' | 'reset'
}

export interface LoadScenarioAction {
  type:     'loadScenario'
  scenario: keyof typeof scenarios
}

export default class Keyboard extends React.Component<Props> {

  public componentWillMount() {
    window.addEventListener('keydown', this.onKeyDown)
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.altKey || event.ctrlKey) { return }

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