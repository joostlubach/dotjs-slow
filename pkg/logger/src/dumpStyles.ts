import {Styles} from './types'
import {kebabCase} from 'lodash'

export default function dumpStyles(styles: Styles): string {
  const clauses = []
  for (const key of Object.keys(styles)) {
    clauses.push(`${kebabCase(key)}: ${styles[key]}`)
  }
  return clauses.join(';')
}