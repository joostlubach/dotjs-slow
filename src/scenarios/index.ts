import {Scenario} from '../program'

export default {
  // @index: ${variable}: |new Scenario(require(${relpathwithext})),
  synchronous: Scenario.load(require('./synchronous.yml'))
  // /index
}