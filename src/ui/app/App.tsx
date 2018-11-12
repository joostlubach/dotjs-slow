import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore, programStore, simulatorStore, musicStore} from '@src/stores'
import Music from './Music'
import Scene from './scene/Scene'
import CodePanels, {panelBarWidth as codePanelBarWidth} from './code/CodePanels'
import CodePanel from './code/CodePanel'
import TopBar from './TopBar'
import Keyboard, {KeyAction} from './Keyboard'
import i18n from 'i18next'
import history from '@src/history'
import {Location, UnregisterCallback} from 'history'
import scenarioMap from '@src/scenarios'
import {Character} from '@src/program'
import ComponentTimer from '../../../pkg/react-component-timer/src/ComponentTimer'

export interface Props {}

interface State {
  zoom: Character | null
}

type ScenarioName = keyof typeof scenarioMap

@observer
export default class App extends React.Component<Props, State> {

  public state: State = {
    zoom: null
  }
  
  private timer = new ComponentTimer(this)

  private unlistenHistory: UnregisterCallback | null = null

  public componentWillMount() {
    this.unlistenHistory = history.listen(this.onHistoryChange)
    simulatorStore.addListener('step', this.onStep) 

    this.loadScenarioFromLocation()
  }

  public componentWillUnmount() {
    simulatorStore.removeListener('step', this.onStep) 
    if (this.unlistenHistory) {
      this.unlistenHistory()
    }
  }

  private performKeyAction(action: KeyAction) {
    switch (action.type) {
    case 'previous':
      this.previous()
      break

    case 'next':
      this.next()
      break

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
      this.goToScenario(action.scenario)
      break
    }
  }

  private previous() {
    if (!simulatorStore.atStart) {
      simulatorStore.backward()
    } else {
      this.loadPreviousScenario()
    }
  }

  private next() {
    if (!simulatorStore.atEnd) {
      simulatorStore.forward()
    } else {
      this.loadNextScenario()
    }
  }

  private loadPreviousScenario() {
    const scenarios = Object.values(scenarioMap)
    const index = programStore.scenario ? scenarios.indexOf(programStore.scenario) : -1
    if (index === 0) { return false }

    const scenario = scenarios[index - 1]
    this.goToScenario(scenario.name)
    return true
  }

  private loadNextScenario() {
    const scenarios = Object.values(scenarioMap)
    const index = programStore.scenario ? scenarios.indexOf(programStore.scenario) : -1
    if (index === scenarios.length - 1) { return false }

    const scenario = scenarios[index + 1] || scenarios[0]
    this.goToScenario(scenario.name)
    return true
  }

  private toggleZoom(character: Character | null) {
    if (this.state.zoom === character) {
      this.setState({zoom: null})
    } else {
      this.setState({zoom: character})
    }
  }

  private goToScenario(name: string) {
    history.push(`/${name}`)
  }

  private onHistoryChange = () => {
    this.loadScenarioFromLocation()
  }

  private loadScenarioFromLocation() {
    const scenario = location.pathname.slice(1)
    if (scenario in scenarioMap) {
      return this.loadScenario(scenario as ScenarioName)      
    } else {
      history.replace('/introduction')
    }
  }

  private loadScenario(scenarioName: ScenarioName) {
    const scenario = scenarioMap[scenarioName]
    if (scenario == null) { return }

    programStore.loadScenario(scenario)
    return scenario
  }

  public render() {
    const fullScreen = programStore.scenario == null || programStore.scenario.fullScreen
    return (
      <div classNames={$.app}>
        <TopBar classNames={$.topBar}/>
        <Panels
          classNames={$.panels}
          fullScreen={fullScreen}
          left={this.renderMain()}
          main={<Scene zoom={this.state.zoom}/>}
          splitterSize={12}
          initialSizes={viewStateStore.panelSizes}
          minimumSizes={{left: 3 * codePanelBarWidth + 12}}
          onPanelResize={sizes => { viewStateStore.panelSizes = sizes }}

          splitterClassNames={$.splitter}
          panelClassNames={$.panel}
          mainClassNames={$.main}
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

  main: {
    overflow: 'hidden',
    '& > *': {
      ...layout.overlay,
    }
  },

  code: {
    ...layout.overlay
  },

  panel: {
    overflow: 'hidden'
  }

})