import I18next from 'i18next'
import {en} from '@src/locales'

I18next.init({
  interpolation: {
    // Not necessary as React already escapes.
    escapeValue: false
  },
  lng:           'en',
  resources:     {en},
  returnObjects: true
})