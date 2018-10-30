export default class Scenario {

  private constructor(
    public readonly name: string
  ) {}

  public static load(yaml: any) {
    const {name, title, codes} = yaml

    const scenario = new Scenario(name)
    scenario.title = title
    scenario.codes = codes
    return scenario
  }

  public title!: string

  public codes!: {
    etienne: string
    marie:   string
    chef:  string
  }

}