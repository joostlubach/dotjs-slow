import {Source, Stage, Character} from './types'
import {mapValues, camelCase} from 'lodash'
import {SpritePosition} from '@src/program'

export default class Scenario {

  private constructor(
    public readonly name: string
  ) {}

  public static load(yaml: any) {
    const {name, title, full_screen: fullScreen = false, stage, initial_positions: initialPositions, bootstrap, codes} = yaml

    const scenario = new Scenario(name)
    scenario.title = title
    scenario.fullScreen = fullScreen
    scenario.stage = stage
    scenario.initialFlipped = {}
    scenario.initialPositions = mapValues(initialPositions, (val: string, key: Character) => {
      if (/^(.*):flipped$/.test(val)) {
        val = RegExp.$1
        scenario.initialFlipped[key] = true
      }
      
      return val == null ? null : SpritePosition[camelCase(val) as any]
    }) as any
    scenario.bootstrap = bootstrap
    scenario.codes = codes || {}
    return scenario
  }

  public title!: string
  public fullScreen: boolean = false

  public bootstrap?: string
  public initialPositions!: Record<Character, SpritePosition | null>
  public initialFlipped!:   Partial<Record<Character, boolean>>

  public stage!: Stage

  public codes!: Record<Source, string>

}