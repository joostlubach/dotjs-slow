import * as colors from './colors'
import Color from 'color'

export interface Overrides {
  x?:      number
  y?:      number
  radius?: number
  offset?: number
  color?:  Color
}

function shadowCreator(base: Overrides) {
  return (overrides: Overrides = {}) => {
    const {
      x      = 0,
      y      = 0,
      radius = 0,
      offset = 0,
      color  = colors.shadow
    } = {...base, ...overrides}

    const shadow: any[] = [x, y, radius, offset, color]
    return shadow
  }
}

export const shallow = shadowCreator({y: 3, radius: 5, color: colors.shadow.alpha(0.4)})
export const medium  = shadowCreator({y: 4, radius: 14, color: colors.shadow.alpha(0.3)})
export const deep    = shadowCreator({y: 10, radius: 30, color: colors.shadow.alpha(0.5)})

export const focus   = [0, 0, 0, 2, colors.focus]
export const modal   = deep({color: colors.shadow.alpha(0.3)})
export const control = [2, 2, 0, 0, colors.shadow.alpha(0.5)]