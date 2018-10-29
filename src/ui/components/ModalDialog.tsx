import React from 'react'
import {jss, colors, layout, shadows} from '@ui/styles'
import ModalPortal from 'react-modal-portal'
import {Label} from '@ui/components'

export interface Props {
  isOpen:         boolean
  onRequestClose: () => any

  onWillOpen?:  () => any
  onDidOpen?:   () => any
  onWillClose?: () => any
  onDidClose?:  () => any

  header?:     React.ReactNode
  caption?:    string,

  classNames?:     React.ClassNamesProp
  width?:          number
  height?:         number
  autoFocusFirst?: boolean
}

export default class ModalDialog extends React.Component<Props> {

  public render() {
    const {isOpen, onRequestClose} = this.props

    return (
      <ModalPortal
        classNames={$.portal}
        isOpen={isOpen}
        onRequestClose={onRequestClose}

        onWillOpen={this.props.onWillOpen}
        onDidOpen={this.props.onDidOpen}
        onWillClose={this.props.onWillClose}
        onDidClose={this.props.onDidClose}

        transitionName={$.transition}
        transitionDuration={layout.durations.medium}
        autoFocusFirst={this.props.autoFocusFirst}
        children={this.renderDialog()}
      />
    )
  }

  private renderDialog() {
    const {width, height, classNames} = this.props

    return (
      <div classNames={[$.dialog, classNames]} style={{width, height}}>
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    )
  }

  private renderHeader() {
    const {header, caption} = this.props
    if (header == null && caption == null) { return null }

    return (
      <div classNames={$.header}>
        {!header && <Label markup bold large>{caption}</Label>}
        {header}
      </div>
    )
  }

  private renderBody() {
    return (
      <div classNames={$.body}>
        {this.props.children}
      </div>
    )
  }

}

const $ = jss({
  portal: {
    ...layout.flex.center,
    padding: layout.padding.xl
  },

  dialog: {
    ...layout.flex.column,
    position: 'relative',
    flex:     [0, 1, 'auto'],

    boxShadow:    shadows.modal,
    background:   colors.primary,
    borderRadius: layout.radius.l,

    '&:focus': {
      outline: 'none'
    }
  },

  transition: {
    '&-open': {
      opacity:    0,
      transform:  'translateY(-20px)'
    },
    '&-open-active': {
      opacity:    1,
      transform: 'translateY(0)',
    },
    '&-close': {
      opacity:    1,
      transform:  'translateY(0)'
    },
    '&-close-active': {
      opacity:    0,
      transform: 'translateY(-20px)'
    },
    '&-open-active, &-close-active': {
      transition: layout.transitions.medium(['transform', 'opacity'], 'cubic-bezier(0, 0.6, 0.6, 1)')
    }
  },

  header: {
    padding: layout.padding.l
  },

  tabBar: {
    margin: [
      layout.padding.m,
      -layout.padding.m,
      -layout.padding.l
    ]
  },

  body: {
    flex: [1, 1, 'auto'],
    ...layout.flex.column,

    overflow: 'auto',
  }

})