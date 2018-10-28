import React from 'react'
import {observer} from 'mobx-react'
import {jss, colors} from '@ui/styles'
import {Panels} from '@ui/components'
import {viewStateStore} from '@src/stores'

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
        right={this.renderScene()}
        splitterSize={12}
        initialSizes={viewStateStore.panelSizes}
        minimumSizes={{left: 480, bottom: 40}}
        onPanelResize={sizes => { viewStateStore.panelSizes = sizes }}

        splitterClassNames={$.splitter}
      />
    )
  }

  private renderCode() {
    return "Code"
  }

  private renderScene() {
    return "Scene"
  }

}

const $ = jss({
  app: {
  },

  splitter: {
    background: colors.horizontalBevel(colors.primary)
  }
})