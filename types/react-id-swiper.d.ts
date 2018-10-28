declare module 'react-id-swiper' {
  import React from 'react'

  export interface SwiperParams {
    [param: string]: any
  }

  export interface SwiperProps extends SwiperParams {
    ContainerEl?:    string
    containerClass?: string
    WrapperEl?:      string
    wrapperClass?:   string
    slideClass?:     string

    shouldSwiperUpdate?: boolean
    rebuildOnUpdate?:    boolean
    noSwiping?:          boolean
    activeSlideKey?:     string | null

    renderPrevButton?: () => React.ReactNode
    renderNextButton?: () => React.ReactNode
    renderScrollbar?:  () => React.ReactNode
    renderPagination?: () => React.ReactNode
    renderParallax?:   () => React.ReactNode
  }

  export interface SwiperInterface {
    slideNext(): void
    slidePrev(): void
  }

  export default class Swiper extends React.Component<SwiperProps> {
    public swiper: SwiperInterface

    public rebuildSwiper(): void
  }
}