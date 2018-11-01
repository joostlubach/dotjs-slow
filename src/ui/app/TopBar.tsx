import React from 'react'
import {observer} from 'mobx-react'
import {jss, layout, colors, shadows} from '../styles'
import {ToolbarButton, Label, SVG, Slider} from '@ui/components'
import {simulatorStore, programStore} from '@src/stores'
import ComponentTimer from 'react-component-timer'
import i18n from 'i18next'
import scenarios from '@src/scenarios'
import {fonts} from '@ui/styles'
import history from '@src/history'

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
        {this.renderScenarioSelector()}
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

  private renderScenarioSelector() {
    const currentScenarioName = programStore.scenario ? programStore.scenario.name : ''

    return (
      <div classNames={$.scenarioSelector}>
        <select value={currentScenarioName} onChange={this.onScenarioChange}>
          {Object.keys(scenarios).map(name => (
            <option
              key={name}
              value={name}
              children={name}
            />
          ))}
        </select>
        <ToolbarButton
          icon='restart'
          small
          onTap={this.onResetTap}
        />
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
          values={[0.25, 0.5, 1, 2, 4]}
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

  private onResetTap = () => {
    programStore.resetScenario()
  }

  private onScenarioChange = (event: React.ChangeEvent<any>) => {
    const name = event.target.value
    history.push(`/${name}`)
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
  },

  scenarioSelector: {
    ...layout.row(layout.padding.inline.m),

    '& select': {
      '-webkit-appearance': 'none',
      
      backgroundColor: colors.white,
      border:          'none',
      borderRadius:    0,
      height:          32,
      
      boxShadow:     shadows.control,
      padding:      [layout.padding.inline.s, layout.padding.inline.m],
      paddingRight: layout.padding.inline.m + 20,

      font:      fonts.normal,
      transform: 'skew(-2deg)',

      background: {
        image:    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAgCAYAAABpRpp6AAAABGdBTUEAALGPC/xhBQAAAVBJREFUWAntlTFIQlEUhjWUIogEhyAEoammwE2HcGmJpsY2aWt1C9pa3cRNcMhJaHITIlqaaoiGaKmWaKhBwYRM7TvoAREFn75XbzgHPu9/7z3n3MMP8gIBC3PAHDAHzAFzwBzoO1BieYa9/taV3w26nMOxK91Gmtyy70EbMiN3s2wTFL2D9BQjXI8YHR9AHhBOYNbYpbAB0qcOafAkInS9Bh06j15w+NIh+d+DHm+s2w7rHacvUXEBOnQFvThllyx53UHtI2t8yrq508TVAujQV+hVmBRBLnKg+Tfo6KRkL89Ph4a4R6+PeSzMWXkor4peHpP3Z0dHvPQD4t4rbIHGCqIG6mwRHdLL/1z3ebwJMtgnpGAN7kCHPUP7KpJM8wEy4BeI26I74MmHgb5zxyYdXkBdbaEPwNchf7xLeIIdX09qw5kD5oA5YA6YA75z4BeXDkVZW8aK0AAAAABJRU5ErkJggg==")',
        repeat:   'no-repeat',
        position: 'center right',
        size:     [22, 16]
      }
    }
  }
})