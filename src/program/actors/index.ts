// @index: import ${variable} from ${relpath}
import Etienne from './Etienne'
import Restaurant from './Restaurant'
// /index

interface ActorClasses {
  // @index: ${variable:camel}: |typeof ${variable}
  etienne:    typeof Etienne
  restaurant: typeof Restaurant
  // /index
}

const ActorClasses = {
  // @index: ${variable:camel}: |${variable},
  etienne:    Etienne,
  restaurant: Restaurant,
  // /index
}

export default ActorClasses