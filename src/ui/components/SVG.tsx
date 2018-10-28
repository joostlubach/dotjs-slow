import React from 'react'
import cn from 'classnames'
import {jss} from '@ui/styles'
import Color from 'color'
import svgs from '@res/svgs'
import {omit, camelCase} from 'lodash'

export interface Props extends Omit<React.SVGAttributes<any>, 'color'> {
  name?:    SVGName
  svg?:     any
  size:     Size
  color?:   Color | null
  inline?:  boolean
  title?:   string

  classNames?: React.ClassNamesProp
}

export type SVGName = keyof typeof svgs

export default class SVG extends React.Component<Props> {

  public render() {
    const {name, size, inline, color, style = {}, classNames, ...props} = this.props
    if (this.props.svg == null && name == null) {
      throw new Error('Need either name or svg')
    }

    if (color) {
      style.fill = color.string()
    }

    const [width, height] = typeof size === 'number'
      ? [size, size]
      : [size.width, size.height]

    Object.assign(props, {width, height})

    const svg = this.props.svg || svgs[name!]
    if (svg == null) {
      return this.renderNotFound(name!, size)
    }

    const element = (
      <svg
        className={cn(classNames, inline ? $.inline : $.block)}
        style={style}
        dangerouslySetInnerHTML={{__html: svg.content}}
        {...omit(camelKaseKeys(svg.attributes), 'xmlns:xlink', 'style')}
        {...omit(props, 'svg')}
      />
    )

    return element
  }

  private renderNotFound(name: string, props: any) {
    const {classNames} = this.props

    return (
      <svg
        className={cn(classNames)}
        {...props}
        title={`SVG \`${name}\` not found`}
        viewBox="0 0 64 64"
      >
        <rect fill='#D30000'  stroke='#FFFFFF' strokeWidth='2' x='0' y='0' width='64' height='64'/>
        <path d='M1,1 L63,63' stroke='#FFFFFF' strokeWidth='2' strokeLinecap='square'/>
        <path d='M63,1 L1,63' stroke='#FFFFFF' strokeWidth='2' strokeLinecap='square'/>
      </svg>
    )
  }

}

function camelKaseKeys(obj: AnyObject) {
  const result: AnyObject = {}
  for (const [key, value] of Object.entries(obj)) {
    result[camelCase(key)] = value
  }
  return result
}

export function svgExists(name: string) {
  return (svgs as any)[name] != null
}

const $ = jss({
  block: {
    display: 'block'
  },
  inline: {
    display: 'inline-block'
  }
})