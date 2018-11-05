import * as React from 'react'
import {jss, layout} from '@ui/styles'
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
    const nextTrack = musicStore.backgroundTrack
    if (nextTrack !== this.playingTrack) {
      if (nextTrack != null) {
        if (this.isPlaying) {
          this.fadeOut(layout.durations.long, () => {
            this.playTrack(nextTrack)
          })
        } else {
          this.playTrack(nextTrack)
        }
      } else {
        this.stopTrack()
      }
    }
  }

  private playingTrack: Track | null = null
  private autoplayPrevented: boolean = false

  private get isPlaying() {
    if (this.playingTrack == null) { return false }
    return !this.playingTrack.audio.paused
  }

  private async playTrack(track: Track) {
    try {
      this.playingTrack = track
      track.audio.currentTime = 0
      track.audio.volume = track.volume
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

  private fadeOut(duration: number, callback: () => any) {
    const audio = this.playingTrack == null ? null : this.playingTrack.audio
    if (audio == null || audio.paused) { return }

    const interval  = 50
    const decrement = audio.volume / (duration / interval)

    const decreaseVolume = () => {
      audio.volume = Math.max(0, audio.volume - decrement)
      if (audio.volume < 0.05) {
        audio.pause()
        audio.currentTime = 0
        callback()
      } else {
        window.setTimeout(decreaseVolume, interval)
      }
      return false
    }

    decreaseVolume()    
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