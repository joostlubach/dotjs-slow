export default class Scenario {

  private constructor(
    public readonly name: string
  ) {}

  public static load(yaml: any) {
    const {name, code} = yaml

    const scenario = new Scenario(name)
    scenario.code = code
    return scenario
  }

  public code!: {
    etienne: string
    server:   string
    mrSlow:     string
  }

}