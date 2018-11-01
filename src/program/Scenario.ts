import {Source, Stage, Character} from './types'
import {mapValues, camelCase} from 'lodash'
import {SpritePosition} from '@src/program'

export default class Scenario {

  private constructor(
    public readonly name: string
  ) {}

  public static load(yaml: any) {
    const {name, title, stage, initial_positions: initialPositions, bootstrap, codes} = yaml

    const scenario = new Scenario(name)
    scenario.title = title
    scenario.stage = stage
    scenario.initialPositions = mapValues(initialPositions, (val: string) => {
      return val == null ? null : SpritePosition[camelCase(val) as any]
    }) as any
    scenario.bootstrap = bootstrap
    scenario.codes = codes || {}
    return scenario
  }

  public title!: string

  public bootstrap?: string
  public initialPositions!: Record<Character, SpritePosition | null>

  public stage!: Stage

  public codes!: Record<Source, string>

}