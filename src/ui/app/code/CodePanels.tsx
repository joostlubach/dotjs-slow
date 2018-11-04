import * as React from 'react'
import {observer} from 'mobx-react'
import {jss, layout} from '@ui/styles'
import CodePanel, {Props as CodePanelProps} from './CodePanel'
import {clamp} from 'lodash'
import {Source, Step} from '@src/program'
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

  public componentDidMount() {
    simulatorStore.addListener('step', this.onStep)
  }

  public componentWillUnmount() {
    simulatorStore.removeListener('step', this.onStep)
  }

  private onStep = (step: Step | null) => {
    if (step == null) { return }

    const {codeLocation} = step
    if (codeLocation == null || codeLocation.source == null) { return }

    this.ensureSourceVisible(codeLocation.source as Source)
  }

  public componentWillReact() {
    if (programStore.errors.length === 0) { return }

    const firstError = programStore.errors[0]
    const codeLocation = firstError.loc
    if (codeLocation == null || codeLocation.source == null) { return }

    this.ensureSourceVisible(codeLocation.source as Source)
  }

  private ensureSourceVisible(source: Source) {
    if (source !== this.previousVisibleSource) {
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
    const panels = Object.values(this.panels)
    const minWidth = panels.length * panelBarWidth

    return (
      <div classNames={[$.codePanels, this.props.classNames]} style={{minWidth}}>
        {Object.values(this.panels)}
      </div>
    )
  }

  private onPanelBarTap = (source: Source) => {
    this.setState({visibleSource: source})
  }

}

export const panelBarWidth = layout.barHeight.normal

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