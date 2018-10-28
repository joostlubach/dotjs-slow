// Augment the react module to accept a classNames prop of a string on HTML elements.
// The file init/classNames.js will convert this into a classNames prop.
import {HTMLAttributes as ReactHTMLAttributes} from 'react'
import {SVGAttributes as ReactSVGAttributes} from 'react'

declare module 'react' {
  export interface HTMLAttributes<T> {
    classNames?: ClassNamesProp
  }
  export interface SVGAttributes<T> {
    classNames?: ClassNamesProp
  }

  export type ClassNamesProp = string | string[] | any
}