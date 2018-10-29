import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore, programStore} from '@src/stores'
import Music from './Music'
import Scene from './scene/Scene'
import CodePanel from './code/CodePanel'
import i18n from 'i18next'

import scenarios from '@src/scenarios'

export interface Props {
  classNames?: React.ClassNamesProp
}

@observer
export default class App extends React.Component<Props> {

  public componentWillMount() {
    programStore.loadScenario(scenarios.synchronous)
  }

  public render() {
    return (
      <>
        <Panels
          classNames={[$.app, this.props.classNames]}
          main={this.renderCode()}
          right={<Scene/>}
          splitterSize={12}
          initialSizes={viewStateStore.panelSizes}
          minimumSizes={{left: 480}}
          onPanelResize={sizes => { viewStateStore.panelSizes = sizes }}

          splitterClassNames={$.splitter}
          panelClassNames={$.panel}
        />
        <Music/>
      </>
    )
  }

  private renderCode() {
    return (
      <div classNames={$.code}>
        <CodePanel
          classNames={$.codePanel}
          image='etienne-head'
          title={i18n.t('etienne')}
          tintColor={colors.etienne}
        />
      </div>        
    )
  }

}

const $ = jss({
  app: {
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
    ...layout.overlay,
    ...layout.flex.row,
    overflow: 'auto'
  },

  codePanel: {
    flex: 1
  }

})