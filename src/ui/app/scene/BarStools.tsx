import * as React from 'react'
import {jss, layout} from '@ui/styles'
import {ResponsiveGrid, SVG} from '@ui/components'
import {times} from 'lodash'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class BarStools extends React.Component<Props> {

  public render() {
    return (
      <ResponsiveGrid minWidth={barStoolSize.width} gap={40}>
        {({columns}) => (
          <div classNames={[$.barStools, this.props.classNames]}>
            <div classNames={$.barStoolsInner}>
              {this.renderStools(columns)}
            </div>
          </div>
        )}
      </ResponsiveGrid>
    )
  }

  private renderStools(count: number) {
    return times(count, i => (
      <SVG key={i} classNames={$.barStool} name='barstool' size={barStoolSize}/>
    ))
  }

}

const barStoolSize = {
  width:  66,
  height: 114
}

const $ = jss({
  barStools: {
    height: barStoolSize.height,
  },

  barStoolsInner: {
    ...layout.overlay,
    ...layout.flex.row,
    justifyContent: 'space-around'
  },

  barStool: {
    
  }
})