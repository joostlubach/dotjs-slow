import Color from 'color'

export const transparent = new Color('transparent')
export const white = new Color('white')
export const black = new Color('black')
export const gray  = new Color('#646464')
export const red = new Color('#D22424')
export const brown = new Color('#AE7320')
export const green = new Color('#2F992E')
export const blue = new Color('#3467A2')
export const lightBlue = new Color('#6694CA')

export const bg = {
  normal: black,
  topBar: gray
}

export const fg = {
  normal: white,
  dim:    white.alpha(0.6),

  link:   red
}

export const border = {

}

export const primary = red
export const etienne = brown
export const marie   = green
export const chef    = blue

export const placeholder = fg.dim
export const shadow = black
export const focus = blue

export const error = red

export function foreground(color: Color) {
  return {
    color:   color,
    '& svg': {fill: color}
  }
}

export function isDark(color: Color) {
  return color.luminosity() < 0.6
}

export function verticalGradient(colors: Color[], positions?: number[]) {
  const stops = positions == null
    ? colors.map(color => color.string())
    : colors.map((color, index) => `${color.string()} ${positions[index] * 100}%`)

  return `linear-gradient(to bottom, ${stops.join(', ')})`
}

export function horizontalGradient(colors: Color[], positions?: number[]) {
  const stops = positions == null
    ? colors.map(color => color.string())
    : colors.map((color, index) => `${color.string()} ${positions[index] * 100}%`)

  return `linear-gradient(to right, ${stops.join(', ')})`
}

export function horizontalBevel(tintColor?: Color) {
  return {
    color: tintColor,
    image: horizontalGradient([white.alpha(0.5), white.alpha(0), black.alpha(0), black.alpha(0.5)], [0, 0.2, 0.8, 1])
  }
}

export function smallHorizontalBevel(tintColor?: Color) {
  return {
    color: tintColor,
    image: horizontalGradient([white.alpha(0.5), white.alpha(0), black.alpha(0), black.alpha(0.5)], [0, 0.05, 0.95, 1])
  }
}

export function spotlightGradient(colors: Color[], positions?: number[]) {
  const stops = positions == null
    ? colors.map(color => color.string())
    : colors.map((color, index) => `${color.string()} ${positions[index] * 100}%`)

  return `radial-gradient(farthest-corner at 30% 30%, ${stops.join(', ')})`
}