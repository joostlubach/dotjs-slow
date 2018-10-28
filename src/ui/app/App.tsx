import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors, layout} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore} from '@src/stores'
import Scene from './scene/Scene'
import CodePanel from './code/CodePanel'
import i18n from 'i18next'

export interface Props {
  classNames?: React.ClassNamesProp
}

@observer
export default class App extends React.Component<Props> {

  public render() {
    return (
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
    )
  }

  private renderCode() {
    return (
      <div classNames={$.code}>
        <CodePanel
          classNames={$.codePanel}
          image='customer-head'
          title={i18n.t('customer')}
          tintColor={colors.customer}
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
    '& > *': {
      ...layout.overlay
    }
  },

  code: {
    ...layout.overlay,
    ...layout.flex.row
  },

  codePanel: {
    flex: 1
  }

})