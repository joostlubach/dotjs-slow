import {Scenario} from '../program'

export default {
  synchronous: Scenario.load(require('./synchronous.yml')),
  polling:     Scenario.load(require('./polling.yml')),
  callback:    Scenario.load(require('./callback.yml')),
  promise:     Scenario.load(require('./promise.yml')),
}