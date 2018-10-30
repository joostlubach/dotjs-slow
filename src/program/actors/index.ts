// @index: import ${variable} from ${relpath}
import Etienne from './Etienne'
import Marie from './Marie'
import Restaurant from './Restaurant'
// /index

interface ActorClasses {
  // @index: ${variable:camel}: |typeof ${variable}
  etienne:    typeof Etienne
  marie:      typeof Marie
  restaurant: typeof Restaurant
  // /index
}

const ActorClasses = {
  // @index: ${variable:camel}: |${variable},
  etienne:    Etienne,
  marie:      Marie,
  restaurant: Restaurant,
  // /index
}

export default ActorClasses