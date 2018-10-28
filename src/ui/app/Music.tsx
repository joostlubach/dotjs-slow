import * as React from 'react'
import {jss} from '@ui/styles'
import {programStore} from '@src/stores'
import {Scenario} from '@src/program'
import {observer} from 'mobx-react'

const backgroundMusic = new Audio('/music/french.mp3')
backgroundMusic.loop = true
backgroundMusic.volume = 0

@observer
export default class Music extends React.Component {

  private previousScenario: Scenario | null = null

  public componentDidMount() {
    if (programStore.scenario != null) {
      this.playBackgroundMusic()
    }
  }

  public componentWillReact() {
    if (programStore.scenario != null && programStore.scenario !== this.previousScenario) {
      this.playBackgroundMusic()
    }
    this.previousScenario = programStore.scenario
  }

  private playBackgroundMusic() {
    backgroundMusic.currentTime = 0
    backgroundMusic.play()
  }

  public render() {
    const _ = programStore.scenario
    return null
  }

}

const $ = jss({
  music: {
  }
})