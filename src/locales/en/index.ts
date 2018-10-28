import {merge} from 'lodash'

// @index(\.yml$): import ${variable} from ${relpathwithext}
import app from './app.yml'
// /index

export default merge(
  // @index(\.yml$): ${variable},
  app,
  // /index
)