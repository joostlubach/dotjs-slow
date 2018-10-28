import React from 'react'

const {platform, userAgent} = window.navigator
export const isIE11 = platform === 'Win32' && userAgent.includes('rv:11.0')

export const padding = {
  inline: {
    xs: 2,
    s:  4,
    m:  8,
    l:  12
  },

  xs:  12,
  s:   16,
  m:   24,
  l:   32,
  xl:  56,
  xxl: 64
}

export const radius = {
  s: 2,
  m: 6,
  l: 10
}

export const icon = {
  xs: {width: 8, height: 8},
  s:  {width: 12, height: 12},
  m:  {width: 16, height: 16},
  l:  {width: 20, height: 20},
  xl: {width: 24, height: 24},
}

export const barHeight = {
  normal: 56,
  large:  64,
  huge:   80
}

export const z = {
  content:      100,
  navigation:   200,
  mobileSearch: 300,
  transition:   500,
  modal:        900,
  popup:        1000,
}

export const flex = {
  column: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'stretch'
  },
  row: {
    display:       'flex',
    flexDirection: 'row',
    alignItems:    'stretch'
  },
  center: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center'
  }
}

export function row(gap: number = padding.m, alignItems: string = 'center') {
  return {
    ...flex.row,
    alignItems,

    '& > :not(:last-child)': {
      marginRight: gap
    }
  }
}

export function column(gap: number = padding.m, alignItems: string = 'stretch') {
  return {
    ...flex.column,
    alignItems,

    '& > :not(:last-child)': {
      marginBottom: gap
    }
  }
}

export const overlay: React.CSSProperties = {
  position: 'absolute',
  top:      0,
  bottom:   0,
  left:     0,
  right:    0
}

//------
// Responsive

export type ScreenSize = 'mobileSmall' | 'mobileLarge' | 'tabletSmall' | 'tabletLarge' | 'desktop'

export interface BreakpointConfig {
  minWidth?:  number
  maxWidth?:  number
  minHeight?: number
  maxHeight?: number
}

export function breakpoint(config: BreakpointConfig) {
  return (styles: AnyObject) => ({
    [`@media screen and ${breakpointSpec(config)}`]: styles
  })
}

export const screenWidths = {
  mobileSmall: 360,
  mobileLarge: 600,
  tabletSmall: 960,
  tabletLarge: 1224,
  desktop:     1224,
}

export const screenMargin = {
  mobileSmall: padding.s,
  mobileLarge: padding.s,
  tabletSmall: padding.m,
  tabletLarge: padding.m,
  swiper:      40,
  desktop:     padding.xl
}

export const mobileSmall = breakpoint({maxWidth: screenWidths.mobileSmall})
export const mobileLarge = breakpoint({maxWidth: screenWidths.mobileLarge})
export const tabletSmall = breakpoint({maxWidth: screenWidths.tabletSmall})
export const tabletLarge = breakpoint({maxWidth: screenWidths.tabletLarge})
export const desktop     = breakpoint({minWidth: screenWidths.tabletLarge})

export function responsive(spec: (size: ScreenSize) => AnyObject) {
  return {
    ...desktop(spec('desktop')),
    ...tabletLarge(spec('tabletLarge')),
    ...tabletSmall(spec('tabletSmall')),
    ...mobileLarge(spec('mobileLarge')),
    ...mobileSmall(spec('mobileSmall')),
  }
}

export function sizeForScreenWidth(width: number): ScreenSize {
  if (width < screenWidths.mobileSmall) {
    return 'mobileSmall'
  }
  if (width < screenWidths.mobileLarge) {
    return 'mobileLarge'
  }
  if (width < screenWidths.tabletSmall) {
    return 'tabletSmall'
  }
  if (width < screenWidths.tabletLarge) {
    return 'tabletLarge'
  }
  return 'desktop'
}

export function breakpointSpec(config: BreakpointConfig) {
  const parts: string[] = []
  
  if (config.minWidth != null) {
    parts.push(`min-width: ${config.minWidth}px`)
  }
  if (config.maxWidth != null) {
    parts.push(`max-width: ${config.maxWidth}px`)
  }
  if (config.minHeight != null) {
    parts.push(`min-height: ${config.minHeight}px`)
  }
  if (config.maxHeight != null) {
    parts.push(`max-height: ${config.maxHeight}px`)
  }

  return `(${parts.join(' and ')})`
}

//------
// Transitions

export const durations = {
  short:      200,
  medium:     300,
  long:       600,
  navigation: isIE11 ? 0 : 300
}

export const transitions = {
  short:      transitionBuilder(durations.short),
  medium:     transitionBuilder(durations.medium),
  long:       transitionBuilder(durations.long),
  navigation: transitionBuilder(durations.navigation)
}

export type Transition = [string, string, string]

function transitionBuilder(duration: number) {
  return (property: string | string[], timing: string = 'ease-in-out') => {
    return transition(property, duration, timing)
  }
}

export function transition(property: string | string[], duration: number = durations.medium, timing: string = 'ease-in-out'): Transition[] {
  const properties = Array.isArray(property) ? property : [property]

  if (properties.length === 0) {
    return [['', `${duration}ms`, timing]]
  } else {
    return properties.map((prop: string): Transition => [prop, `${duration}ms`, timing])
  }
}