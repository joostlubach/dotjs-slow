import * as colors from './colors'

export const clearInput = {
  display:  'block',
  minWidth: 0,
  width:    '100%',
  border:   'none',

  '-moz-appearance': 'textfield',
  '-webkit-appearance': 'textfield',

  '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::-webkit-search-results-button, &::-webkit-search-results-decoration': {
    '-webkit-appearance': 'none',
  },

  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0
  },

  fontWeight: 500,

  '&::placeholder': {
    color: colors.placeholder,
  }
}