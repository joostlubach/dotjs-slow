import JSS from 'jss'

// @index: import * as ${variable} from ${relpath}; export {${variable}}
import * as borders from './borders'; export {borders}
import * as colors from './colors'; export {colors}
import * as fonts from './fonts'; export {fonts}
import * as layout from './layout'; export {layout}
import * as presets from './presets'; export {presets}
import * as shadows from './shadows'; export {shadows}
// /index

import {Transition} from './layout'
export {Transition}

// Pre-fab styles

export type StyleMap<K extends string> = {
  [key in K]: AnyObject
}
export type ClassNameMap<T extends StyleMap<any>> = {
  [key: string]: undefined
} & {
  [key in keyof T]: string
}

export function jss<T extends StyleMap<any>>(styles: T): ClassNameMap<T> {
  return JSS.createStyleSheet(styles).attach().classes as ClassNameMap<T>
}

let keyframesCounter = 0

export function jssKeyframes(name: string, config: AnyObject) {
  const key = `${name}-${++keyframesCounter}`

  const stylesheet = JSS.createStyleSheet({
    [`@keyframes ${key}`]: config
  })
  stylesheet.attach()

  return key
}