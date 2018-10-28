import * as colors from './colors'
import Color from 'color'

function createBorder(color: Color, width: number = 1, style: string = 'solid') {
  return [width, style, color]
}

export const borders = Object.entries(colors.border).reduce((borders, [key, color]) => ({
  ...borders,
  [key]: createBorder.bind(null, color)
}), {})
