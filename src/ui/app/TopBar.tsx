import React from 'react'
import {observer} from 'mobx-react'
import {jss, layout, colors, shadows} from '../styles'
import {ToolbarButton, Label, SVG, Slider} from '@ui/components'
import {simulatorStore} from '@src/stores'
import ComponentTimer from 'react-component-timer'
import i18n from 'i18next'

export interface Props {
  classNames?: React.ClassNamesProp
}

@observer
export default class TopBar extends React.Component<Props> {

  private timer = new ComponentTimer(this)

  public render() {
    return (
      <div classNames={[$.topBar, this.props.classNames]}>
        {this.renderLeft()}
        {this.renderRight()}
      </div>
    )
  }

  private renderLeft() {
    return (
      <div classNames={$.left}>
        <SVG name='logo' size={logoSize}/>
        <Label large>{i18n.t('title')}</Label>
      </div>
    )
  }

  private renderRight() {
    return (
      <div classNames={$.right}>
        {this.renderPlayButton()}
        {this.renderPauseButton()}
        {this.renderBackwardButton()}
        {this.renderForwardButton()}
        {this.renderRestartButton()}
        {this.renderFPSSlider()}
      </div>
    )
  }

  private renderPlayButton() {
    if (simulatorStore.running) { return }

    const enabled = !simulatorStore.atEnd
    return (
      <ToolbarButton
        icon='play'
        disabled={!enabled}
        onTap={this.onPlayTap}
      />
    )
  }

  private renderPauseButton() {
    if (!simulatorStore.running) { return }

    return (
      <ToolbarButton
        icon='pause'
        onTap={this.onPauseTap}
      />
    )
  }

  private renderBackwardButton() {
    const enabled = simulatorStore.active && !simulatorStore.running && !simulatorStore.atStart

    return (
      <ToolbarButton
        icon='step-back'
        disabled={!enabled}
        onTap={this.onBackwardTap}
      />
    )
  }

  private renderForwardButton() {
    const enabled = !simulatorStore.running && !simulatorStore.atEnd

    return (
      <ToolbarButton
        icon='step-forward'
        disabled={!enabled}
        onTap={this.onForwardTap}
      />
    )
  }

  private renderRestartButton() {
    const enabled = !simulatorStore.running && simulatorStore.active

    return (
      <ToolbarButton
        icon='restart'
        disabled={!enabled}
        onTap={this.onRestartTap}
      />
    )
  }

  private renderFPSSlider() {
    return (
      <div classNames={$.fpsSliderContainer}>
        <Slider
          classNames={$.fpsSlider}
          values={[1, 2, 3, 5, 8, 13]}
          value={simulatorStore.fps}
          onChange={value => { simulatorStore.fps = value }}
        />
      </div>
    )
  }

  // private renderVerboseSwitch() {
  //   return (
  //     <div classNames={$.verboseSwitchContainer}>
  //       <Switch
  //         classNames={$.verboseSwitch}
  //         isOn={simulatorStore.verbose}
  //         onChange={on => { simulatorStore.verbose = on }}
  //       />
  //       <div>Verbose</div>
  //     </div>
  //   )
  // }

  // private run() {
  //   simulatorStore.run()

  //   if (simulatorStore.hasInfiniteLoop) {
  //     MessageBox.show({
  //       title:   "Infinite loop",
  //       message: "Your program probably contains an infinite loop.",

  //       body: (
  //         <div classNames={$.infiniteLoop}>
  //           <SpinningRover/>,
  //           <Markdown>{i18n.t('infinite_loop')}</Markdown>
  //         </div>
  //       ),
  //       buttons: [{label: "Oops!"}]
  //     })
  //   }
  // }

  //------
  // Event handlers

  private onPlayTap = () => {
    simulatorStore.run()
  }

  private onForwardTap = () => {
    simulatorStore.forward()
  }

  private onBackwardTap = () => {
    simulatorStore.backward()
  }

  private onPauseTap = () => {
    simulatorStore.pause()
  }

  private onRestartTap = () => {
    simulatorStore.reset()
  }

}

const logoSize = {
  width:  33,
  height: 40
}

export const height = logoSize.height + 2 * layout.padding.s

const $ = jss({
  topBar: {
    ...layout.row(layout.padding.s),
    justifyContent: 'space-between',

    padding: [layout.padding.inline.m, layout.padding.s],
    height:  height,

    boxShadow: shadows.medium(),

    background: {
      color: colors.bg.topBar,
      image: colors.verticalGradient([colors.white.alpha(0.1), colors.black.alpha(0.1)])
    },
  },

  section: {
    ...layout.row(layout.padding.s)
  },

  left: {
    extend: 'section'
  },

  right: {
    extend: 'section'
  },

  fpsSlider: {
    width: 80
  }
})