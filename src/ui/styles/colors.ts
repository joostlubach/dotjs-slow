import Color from 'color'

export const white = new Color('white')
export const black = new Color('black')

export const bg = {
  normal: black
}

export const fg = {
  normal: white,
  dim:    white.alpha(0.6)
}

export const border = {

}

export const placeholder = fg.dim
export const shadow = black

export function foreground(color: Color) {
  return {
    color:   color,
    '& svg': {fill: color}
  }
}

export function isDark(color: Color) {
  return color.luminosity() < 0.6
}

export function verticalGradient(...colors: Color[]) {
  return `linear-gradient(top, ${colors.map(c => c.string()).join(', ')})`
}

export function horizontalGradient(...colors: Color[]) {
  return `linear-gradient(left, ${colors.map(c => c.string()).join(', ')})`
}