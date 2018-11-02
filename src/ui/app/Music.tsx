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

    window.addEventListener('keydown', this.onKeyDown)
    ;(window as any).Music = this
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
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
  private autoplayPrevented: boolean = false

  private async playTrack(track: Track) {
    try {
      this.playingTrack = track
      track.audio.currentTime = 0
      await track.audio.play()
      this.autoplayPrevented = false
    } catch (error) {
      // tslint:disable-next-line no-console
      console.warn("Cannot play music", error)
      this.autoplayPrevented = true
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

  private onKeyDown = () => {
    if (this.playingTrack != null && this.autoplayPrevented) {
      this.playTrack(this.playingTrack)
    }
  }

}

const $ = jss({
  music: {
  }
})