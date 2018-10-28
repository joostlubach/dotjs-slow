declare interface Size {
  width:  number
  height: number
}

declare interface Rect extends Size {
  top: number
  left: number
}

declare interface Insets {
  left:   number
  right:  number
  top:    number
  bottom: number
}

declare type Padding = number | Partial<Insets>