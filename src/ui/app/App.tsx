import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore, programStore} from '@src/stores'
import Music from './Music'
import Scene from './scene/Scene'
import CodePanels from './code/CodePanels'
import CodePanel from './code/CodePanel'
import TopBar from './TopBar'
import i18n from 'i18next'

import scenarios from '@src/scenarios'

export interface Props {}

@observer
export default class App extends React.Component<Props> {

  public componentWillMount() {
    programStore.loadScenario(scenarios.synchronous)
  }

  public render() {
    return (
      <div classNames={$.app}>
        <TopBar classNames={$.topBar}/>
        <Panels
          classNames={$.panels}
          main={this.renderMain()}
          right={<Scene/>}
          splitterSize={12}
          initialSizes={viewStateStore.panelSizes}
          minimumSizes={{left: 480}}
          onPanelResize={sizes => { viewStateStore.panelSizes = sizes }}

          splitterClassNames={$.splitter}
          panelClassNames={$.panel}
        />
        <Music/>
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