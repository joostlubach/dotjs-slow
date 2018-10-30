import * as React from 'react'
import {observer} from 'mobx-react'
import {jss, layout} from '@ui/styles'
import CodePanel, {Props as CodePanelProps} from './CodePanel'
import {clamp} from 'lodash'
import {Source} from '@src/program'
import {programStore, simulatorStore} from '@src/stores'

export interface Props {
  classNames?: React.ClassNamesProp
  children?:   React.ReactNode
}

interface State {
  visibleSource: Source
}

@observer
export default class CodePanels extends React.Component<Props, State> {

  public state: State = {
    visibleSource: 'etienne'
  }

  private previousVisibleSource: Source | null = null

  public componentWillReact() {
    const step = simulatorStore.currentStep
    const firstError = programStore.errors.length > 0 ? programStore.errors[0] : null
    const codeLocation =
      firstError != null ? firstError.loc :
      step != null ? step.codeLocation :
      null

    const source = codeLocation == null ? null : codeLocation.source    
    if (source != null && source !== this.previousVisibleSource) {
      this.setState({visibleSource: source as Source})
      this.previousVisibleSource = source as Source
    }
  }

  private get panelSources() {
    return this.mapPanels(panel => panel.props.source)
  }

  private get panels() {
    const {panelSources, visiblePanelIndex} = this

    const panelStyle = (index: number): React.CSSProperties => {
      let translateX: string
      if (index <= visiblePanelIndex) {
        translateX = `${index * panelBarWidth}px`
      } else {
        translateX = `calc(100% + ${(index - 1) * panelBarWidth}px)`
      }

      return {
        right:     (panelSources.length - 1) * panelBarWidth,
        transform: `translateX(${translateX})`
      }
    }

    return this.mapPanels((panel, index) => (
      <div classNames={$.panel} key={panel.props.source} style={panelStyle(index)}>
        {React.cloneElement(panel, {onLeftBarTap: this.onPanelBarTap.bind(null, panel.props.source)})}
      </div>
    ))
  }

  private mapPanels<T>(callback: (panel: React.ReactElement<CodePanelProps>, index: number) => T) {
    const values: T[] = []
    React.Children.forEach(this.props.children, child => {
      if (!React.isValidElement(child)) { return }
      if (child.type !== CodePanel as any) { return }

      values.push(callback(child as any, values.length))
    })
    return values
  }

  private get visiblePanelIndex() {
    const {visibleSource} = this.state
    const index = this.panelSources.indexOf(visibleSource)
    return clamp(index, 0, this.panelSources.length)
  }

  public render() {
    const _ = [simulatorStore.currentStep, programStore.errors]

    return (
      <div classNames={[$.codePanels, this.props.classNames]}>
        {Object.values(this.panels)}
      </div>
    )
  }

  private onPanelBarTap = (source: Source) => {
    this.setState({visibleSource: source})
  }

}

const panelBarWidth = layout.barHeight.normal

const $ = jss({
  codePanels: {
    overflow: 'hidden'
  },

  panel: {
    ...layout.overlay,
    '& > *': {
      ...layout.overlay,
    },

    transition: layout.transitions.medium('transform'),
    willChange: 'transform'
  }
})