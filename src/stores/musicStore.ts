import {observable, reaction, autorun, computed} from 'mobx'
import programStore from './programStore'
import {Scenario} from '@src/program'

const BACKGROUND_MUSIC: Record<string, Track> = {
  synchronous: loadTrack('/music/synchronous.mp3', 0.1, 68),
  callback:    loadTrack('/music/callback.mp3', 0.1, 96),
  promise:     loadTrack('/music/promise.mp3', 0.15, 76),
  ending:      loadTrack('/music/ending.mp3', 0.15, 42, false),
}

export interface Track {
  audio:  HTMLAudioElement
  volume: number
  bpm:    number
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

  public loadBackgroundTrack(scenario: Scenario | null) {
    const scenarioName = scenario == null ? null : scenario.name
    this.backgroundTrack = scenarioName && BACKGROUND_MUSIC[scenarioName] || null
  }

}

function loadTrack(path: string, volume: number, bpm: number, loop: boolean = true) {
  const audio = new Audio(path)
  audio.loop = loop
  
  return {audio, volume, bpm}
}

export default new MusicStore()