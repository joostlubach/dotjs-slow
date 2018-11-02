import * as React from 'react'
import {jss, fonts, colors, layout} from '@ui/styles'
import Color from 'color'

export interface Props {
  children:    React.ReactNode
  classNames?: React.ClassNamesProp
  color?:      Color

  markup?:       boolean
  small?:        boolean
  large?:        boolean

  bold?:     boolean
  semi?:     boolean
  dim?:      boolean
  truncate?: boolean
}

interface MarkupPart {
  text:       string
  classNames: string[]
}

export default class Label extends React.Component<Props> {

  public render() {
    const {markup, color, children} = this.props

    const classNames = [
      $.label,
      this.props.small && $.small,
      this.props.large && $.large,
      this.props.bold && $.bold,
      this.props.semi && $.semi,
      this.props.dim && $.dim,
      this.props.truncate && $.truncate,
      this.props.classNames
    ]

    const style: React.CSSProperties = color ? {color: color.string()} : {}

    return (
      <div classNames={classNames} style={style}>
        {markup && this.renderWithMarkup()}
        {!markup && children}
      </div>
    )
  }

  private renderWithMarkup() {
    const text = React.Children.toArray(this.props.children).join(' ')
    const parts = parseMarkup(text)

    return (
      <>
        {parts.map(({classNames, text}, index) => React.createElement('span', {key: index, classNames}, text))}
      </>
    )
  }

}

const $ = jss({
  label: {
    fontFamily: fonts.normal.family,

    '& a[href]': {
      color: colors.fg.link,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    },

    '& em': {
      color:     colors.lightBlue,
      fontStyle: 'normal',
      fontWeight: 600
    },
  },

  small: {
    font: fonts.small
  },

  large: {
    font: fonts.large
  },

  semi: {
    fontWeight: 600
  },

  bold: {
    fontWeight: 700
  },

  dim: {
    color: colors.fg.dim
  },

  underline: {
    textDecoration: 'underline'
  },

  monospace: {
    font: fonts.monospace
  },

  truncate: {
    whiteSpace:   'nowrap',
    overflow:     'hidden',
    textOverflow: 'ellipsis',
    minWidth:     0
  }
})

interface ParserState {
  pos:        number
  classNames: Set<string>
}

interface Boundary {
  index:     number
  start:     number
  end:       number
  className: string
}

const matchers: Array<[string, string]> = [
  ['**', $.bold],
  ['++', $.underline],
  ['`',  $.monospace]
]

function parseMarkup(text: string): MarkupPart[] {
  const state: ParserState  = {pos: 0, classNames: new Set()}
  const parts: MarkupPart[] = []

  const findNextBoundary = () => {
    const remaining = text.slice(state.pos)

    const occurrences = matchers
      .map(([boundary, className], index): Boundary | null => {
        const start = remaining.indexOf(boundary)
        if (start === -1) { return null }

        return {
          index,
          start: state.pos + start,
          end:   state.pos + start + boundary.length,
          className
        }
      }).filter(Boolean) as Boundary[]
    if (occurrences.length === 0) { return null }

    occurrences.sort((a, b) => a.start === b.start ? a.index - b.index : a.start - b.start)
    return occurrences[0]
  }
  const toggleStyle = (className: string) => {
    if (state.classNames.has(className)) {
      state.classNames.delete(className)
    } else {
      state.classNames.add(className)
    }
  }

  while (state.pos < text.length) {
    const nextBoundary = findNextBoundary()
    if (nextBoundary == null) {
      parts.push({classNames: [...state.classNames], text: text.slice(state.pos)})
      state.pos = text.length
    } else {
      if (nextBoundary.start > state.pos) {
        parts.push({classNames: [...state.classNames], text: text.slice(state.pos, nextBoundary.start)})
      }

      toggleStyle(nextBoundary.className)
      state.pos = nextBoundary.end
    }
  }

  return parts
}