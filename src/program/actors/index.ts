// @index: import ${variable} from ${relpath}
import Chef from './Chef'
import Etienne from './Etienne'
import Marie from './Marie'
import Restaurant from './Restaurant'
// /index

interface ActorClasses {
  // @index: ${variable:camel}: |typeof ${variable}
  chef:       typeof Chef
  etienne:    typeof Etienne
  marie:      typeof Marie
  restaurant: typeof Restaurant
  // /index
}

const ActorClasses = {
  // @index: ${variable:camel}: |${variable},
  chef:       Chef,
  etienne:    Etienne,
  marie:      Marie,
  restaurant: Restaurant,
  // /index
}

export default ActorClasses