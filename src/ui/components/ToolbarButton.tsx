import React from 'react'
import {jss, colors, layout, fonts} from '../styles'
import {Tappable, SVG} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  icon:      SVGName
  small?:    boolean
  disabled?: boolean
  onTap:     () => void

  classNames?: React.ClassNamesProp
}

export default class ToolbarButton extends React.Component<Props> {

  public render() {
    const {icon, disabled = false, small, onTap} = this.props
    const classNames = [
      $.toolbarButton,
      small && $.small,
      disabled && $.disabled,
      this.props.classNames
    ]
    const iconClassNames = [
      $.icon,
      small && $.smallIcon,
      disabled && $.iconDisabled
    ]

    return (
      <Tappable classNames={classNames} onTap={disabled ? undefined : onTap}>
        <SVG classNames={iconClassNames} name={icon} size={small ? size.small : size.normal}/>
      </Tappable>
    )	
  }

}

const size = {
  normal: {
    width:  40,
    height: 40
  },
  small: {
    width:  24,
    height: 24
  }
}

const $ = jss({
  toolbarButton: {
    ...size.normal,
    ...layout.flex.center,
    cursor: 'pointer'
  },

  small: {
    ...size.small,
  },

  disabled: {
    opacity: 0.3,
    cursor:  'default'
  },

  icon: {
    filter:    `drop-shadow(2px 2px 0 ${colors.shadow.alpha(0.5)})`,
    transform: 'skew(-2deg)',

    fill: colors.white,
    '&:hover': {
      fill: colors.primary
    }
  },

  iconDisabled: {
    filter:  'unset',
    '&:hover': {
      fill: colors.white
    }
  }
})