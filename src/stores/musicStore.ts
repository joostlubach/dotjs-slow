import {observable, reaction, autorun, computed} from 'mobx'
import programStore from './programStore'
import {Scenario} from '@src/program'

const BACKGROUND_MUSIC: Record<string, Track> = {
  synchronous: loadTrack('/music/synchronous.mp3', 0.2, 68),
  polling:     loadTrack('/music/polling.mp3', 0.2, 120),
  callback:    loadTrack('/music/callback.mp3', 0.2, 96),
  promise:     loadTrack('/music/promise.mp3', 0.3, 50),
}

export interface Track {
  audio: HTMLAudioElement
  bpm:   number
}

export class MusicStore {

  constructor() {
    autorun(() => {
      this.loadBackgroundTrack(programStore.scenario)
    })
  }

  @observable
  public backgroundTrack: Track | null = null

  @computed
  public get currentBPM(): number | null {
    if (this.backgroundTrack == null) { return null }
    return this.backgroundTrack.bpm
  }

  private loadBackgroundTrack(scenario: Scenario | null) {
    const scenarioName = scenario == null ? null : scenario.name
    this.backgroundTrack = scenarioName && BACKGROUND_MUSIC[scenarioName] || null
  }

}

function loadTrack(path: string, volume: number, bpm: number) {
  const audio = new Audio(path)
  audio.loop = true
  audio.volume = volume
  
  return {audio, bpm}
}

export default new MusicStore()