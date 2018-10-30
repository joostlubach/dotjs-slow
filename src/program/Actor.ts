import Program from './Program'

export type Variant = 'sync' | 'async' | 'callback' | 'promise'

export default class Actor {

  public constructor(
    public program: Program
  ) {}

}