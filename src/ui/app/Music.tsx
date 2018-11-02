import * as React from 'react'
import {jss} from '@ui/styles'
import {musicStore, Track} from '@src/stores'
import {observer} from 'mobx-react'

@observer
export default class Music extends React.Component {

  public componentDidMount() {
    if (musicStore.backgroundTrack != null) {
      this.playTrack(musicStore.backgroundTrack)
    }
  }

  public componentWillReact() {
    if (musicStore.backgroundTrack !== this.playingTrack) {
      if (musicStore.backgroundTrack != null) {
        this.stopTrack()
        this.playTrack(musicStore.backgroundTrack)
      } else {
        this.stopTrack()
      }
    }
  }

  private playingTrack: Track | null = null

  private async playTrack(music: Track) {
    try {
      this.playingTrack = music
      music.audio.currentTime = 0
      await music.audio.play()
    } catch (error) {
      console.warn("Cannot play music", error)
    }
  }

  private stopTrack() {
    if (this.playingTrack == null) { return }

    this.playingTrack.audio.pause()
    this.playingTrack.audio.currentTime = 0
    this.playingTrack = null
  }

  public render() {
    const _ = musicStore.backgroundTrack
    return null
  }

}

const $ = jss({
  music: {
  }
})