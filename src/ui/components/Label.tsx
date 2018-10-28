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
  tag:        string
  text:       string
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
        {parts.map(({tag, text}, index) => React.createElement(tag, {key: index}, text))}
      </>
    )
  }

}

const $ = jss({
  label: {
    fontFamily: fonts.normal.family,
    lineHeight: '24px',

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

  truncate: {
    whiteSpace:   'nowrap',
    overflow:     'hidden',
    textOverflow: 'ellipsis',
    minWidth:     0
  }
})

function parseMarkup(text: string): MarkupPart[] {
  const re = /\*.*?\*/
  const parts = []

  let remaining = text
  for (let match = remaining.match(re); match != null; match = remaining.match(re)) {
    const {index} = match
    if (index == null) { break }

    if (index > 0) {
      parts.push({tag: 'span', text: remaining.slice(0, index)})
    }

    parts.push({tag: 'em', text: match[0].slice(1, -1)})
    remaining = remaining.slice(index + match[0].length)
  }

  if (remaining.length > 0) {
    parts.push({tag: 'span', text: remaining})
  }

  return parts
}