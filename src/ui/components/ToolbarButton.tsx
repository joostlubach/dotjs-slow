import React from 'react'
import {jss, colors, layout, fonts} from '../styles'
import {Tappable, SVG} from '@ui/components'
import {SVGName} from '@ui/components/SVG'

export interface Props {
  icon:      SVGName,
  disabled?: boolean,
  onTap:     () => void,

  classNames?: React.ClassNamesProp
}

export default class ToolbarButton extends React.Component<Props> {

  public render() {
    const {icon, disabled = false, onTap} = this.props
    const classNames = [
      $.toolbarButton,
      disabled && $.disabled,
      this.props.classNames
    ]
    const iconClassNames = [
      $.icon,
      disabled && $.iconDisabled
    ]

    return (
      <Tappable classNames={classNames} onTap={disabled ? undefined : onTap}>
        <SVG classNames={iconClassNames} name={icon} size={size}/>
      </Tappable>
    )	
  }

}

const size = {
  width:  40,
  height: 40
}

const $ = jss({
  toolbarButton: {
    ...size,
    ...layout.flex.center,
    cursor: 'pointer'
  },

  disabled: {
    opacity: 0.3,
    cursor:  'default'
  },

  icon: {
    filter: `drop-shadow(2px 2px 0 ${colors.shadow.alpha(0.5)})`,

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