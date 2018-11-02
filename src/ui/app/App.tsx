import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore, programStore, simulatorStore} from '@src/stores'
import Music from './Music'
import Scene from './scene/Scene'
import CodePanels from './code/CodePanels'
import CodePanel from './code/CodePanel'
import TopBar from './TopBar'
import Keyboard, {KeyAction} from './Keyboard'
import i18n from 'i18next'
import history from '@src/history'
import {Location, UnregisterCallback} from 'history'
import scenarios from '@src/scenarios'
import {Character} from '@src/program'

export interface Props {}

interface State {
  zoom: Character | null
}

@observer
export default class App extends React.Component<Props, State> {

  public state: State = {
    zoom: null
  }
  
  private unlistenHistory: UnregisterCallback | null = null

  public componentWillMount() {
    this.unlistenHistory = history.listen(this.onHistoryChange)
    simulatorStore.addListener('step', this.onStep) 
    this.loadScenario()
  }

  public componentWillUnmount() {
    simulatorStore.removeListener('step', this.onStep) 
    if (this.unlistenHistory) {
      this.unlistenHistory()
    }
  }

  private performKeyAction(action: KeyAction) {
    switch (action.type) {
    case 'zoom':
      this.toggleZoom(action.character)
      break

    case 'simulator':
      switch (action.action) {
        case 'playPause':
          if (simulatorStore.running) {
            simulatorStore.pause()
          } else {
            simulatorStore.resume()
          }
          break
        case 'forward':
          simulatorStore.forward()
          break
        case 'backward':
          simulatorStore.backward()
          break
        case 'reset':
          simulatorStore.reset()
          break
      }
      break
    
    case 'loadScenario':
      programStore.loadScenario(action.scenario)
      break
    }
  }

  private toggleZoom(character: Character | null) {
    if (this.state.zoom === character) {
      this.setState({zoom: null})
    } else {
      this.setState({zoom: character})
    }
  }

  private onHistoryChange = (location: Location) => {
    this.loadScenario()
  }

  private loadScenario() {
    const scenario = location.pathname.slice(1)
    if (scenario in scenarios) {
      programStore.loadScenario(scenario as keyof typeof scenarios)
    } else {
      history.replace('/introduction')
    }
  }

  public render() {
    return (
      <div classNames={$.app}>
        <TopBar classNames={$.topBar}/>
        <Panels
          classNames={$.panels}
          main={this.renderMain()}
          right={<Scene zoom={this.state.zoom}/>}
          splitterSize={12}
          initialSizes={viewStateStore.panelSizes}
          minimumSizes={{left: 480}}
          onPanelResize={sizes => { viewStateStore.panelSizes = sizes }}

          splitterClassNames={$.splitter}
          panelClassNames={$.panel}
        />
        <Music/>
        <Keyboard onAction={action => this.performKeyAction(action)}/>
      </div>
    )
  }

  private renderMain() {
    return (
      <div classNames={$.main}>
        {this.renderCodePanels()}
      </div>        
    )
  }

  private renderCodePanels() {
    return (
      <CodePanels classNames={$.code}>
        <CodePanel
          source='etienne'
          image='etienne-head'
          title={i18n.t('etienne')}
          tintColor={colors.etienne}
        />
        <CodePanel
          source='marie'
          image='marie-head'
          title={i18n.t('marie')}
          tintColor={colors.marie}
        />
        <CodePanel
          source='chef'
          image='chef-head'
          title={i18n.t('chef')}
          tintColor={colors.chef}
        />
      </CodePanels>
    )
  }

  private onStep = () => {
    this.setState({zoom: null})
  }

}

const $ = jss({
  app: {
    ...layout.overlay,
    ...layout.flex.column,    
  },

  topBar: {
    position: 'relative',
    zIndex:   10,
  },

  panels: {
    position: 'relative',
    zIndex:   5,
    flex:     [1, 0, 0]
  },

  splitter: {
    background: colors.horizontalBevel(colors.primary)
  },

  panel: {
    overflow: 'hidden',
    '& > *': {
      ...layout.overlay,
    }
  },

  code: {
    ...layout.overlay
  }

})