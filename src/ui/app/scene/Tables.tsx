import * as React from 'react'
import {jss, layout} from '@ui/styles'
import {ResponsiveGrid, SVG} from '@ui/components'
import {times} from 'lodash'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class Tables extends React.Component<Props> {

  public render() {
    return (
      <ResponsiveGrid minWidth={tableSize.width} minHeight={tableSize.height} gap={40}>
        {({rows, columns}) => (
          <div classNames={[$.tables, this.props.classNames]}>
            <div classNames={$.tablesInner}>
              {this.renderStools(rows, columns)}
            </div>
          </div>
        )}
      </ResponsiveGrid>
    )
  }

  private renderStools(rows: number, columns: number) {
    return times(rows, row => (
      <div key={row} classNames={$.row}>
        {times(columns, column => (
          <SVG key={column} classNames={$.table} name='table' size={tableSize}/>
        ))}
      </div>
    ))
  }

}

const tableSize = {
  width:  161,
  height: 156
}

const $ = jss({
  tables: {
  },

  tablesInner: {
    ...layout.overlay,
    ...layout.flex.column,
    justifyContent: 'space-around'
  },

  row: {
    ...layout.flex.row,
    justifyContent: 'space-around'
  },

  table: {
    ...tableSize    
  }
})