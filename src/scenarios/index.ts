import {Scenario} from '../program'

export default {
  introduction: Scenario.load(require('./introduction.yml')),
  synchronous:  Scenario.load(require('./synchronous.yml')),
  callback:     Scenario.load(require('./callback.yml')),
  promise:      Scenario.load(require('./promise.yml')),
  ending:       Scenario.load(require('./ending.yml')),
}