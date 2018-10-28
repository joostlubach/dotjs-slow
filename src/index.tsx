import '@src/init'
import React from 'react'
import {render} from 'react-dom'
import {jss, colors, fonts, layout} from '@ui/styles'
import App from '@ui/app/App'
import './ui/reset.css'
import './ui/fonts.css'

const version = process.env.VERSION as string

if (version !== localStorage.getItem('version')) {
  localStorage.clear()
  localStorage.setItem('version', version)
  document.location!.reload()
} else {
  render((
    <App/>
  ), document.getElementById('root'))
}

// ModalPortal.zIndex = layout.z.modal

jss({
  '@global': {
    'body': {
      font:       fonts.normal,
      background: colors.bg.normal,
      color:      colors.fg.normal,
    }
  }
})