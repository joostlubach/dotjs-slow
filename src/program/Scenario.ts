export default class Scenario {

  private constructor(
    public readonly name: string
  ) {}

  public static load(yaml: any) {
    const {name, codes} = yaml

    const scenario = new Scenario(name)
    scenario.codes = codes
    return scenario
  }

  public codes!: {
    etienne: string
    marie:   string
    chef:  string
  }

}