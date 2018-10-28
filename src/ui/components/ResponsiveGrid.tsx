import * as React from 'react'
import {jss, layout} from '@ui/styles'
import {range, times, throttle} from 'lodash'
import sizeMe, {SizeMeProps} from 'react-sizeme'

export interface Props {
  rows?:    number | Range
  columns?: number | Range

  minWidth?:   number
  minHeight?:  number
  gap?:        number | Gaps
  maxColumns?: number

  children:    (props: ChildrenProps) => React.ReactNode
}

export interface Range {
  min?: number
  max?: number
}

export interface Gaps {
  horizontal?: number
  vertical?:   number
}

export interface ChildrenProps {
  columns: number
  rows:    number
}

type AllProps = Props & SizeMeProps

class ResponsiveGrid extends React.Component<AllProps> {

  private get horizontalGap() {
    const {gap = 0} = this.props
    if (typeof gap === 'number') { return gap }

    return gap.horizontal || 0
  }

  private get verticalGap() {
    const {gap = 0} = this.props
    if (typeof gap === 'number') { return gap }

    return gap.vertical || 0
  }

  private calculateColumns() {
    const {columns = {}, size, minWidth} = this.props
    if (typeof columns === 'number') { return columns }
    if (minWidth == null) { return 1 }

    const gap = this.horizontalGap

    let calculatedColumns = Math.floor((size.width! + gap) / (minWidth + gap))
    if (columns.min != null) {
      calculatedColumns = Math.max(calculatedColumns, columns.min)
    }
    if (columns.max != null) {
      calculatedColumns = Math.min(calculatedColumns, columns.max)
    }
    return calculatedColumns
  }

  private calculateRows() {
    const {rows = {}, size, minHeight} = this.props
    if (typeof rows === 'number') { return rows }
    if (minHeight == null) { return 1 }

    const gap = this.verticalGap
    let calculatedRows = Math.floor((size.height! + gap) / (minHeight + gap))
    if (rows.min != null) {
      calculatedRows = Math.max(calculatedRows, rows.min)
    }
    if (rows.max != null) {
      calculatedRows = Math.min(calculatedRows, rows.max)
    }
    return calculatedRows
  }

  public render() {
    const props = {
      rows:    this.calculateRows(),
      columns: this.calculateColumns()
    }
    return this.props.children(props)
  }

}

export default sizeMe({monitorWidth: true, monitorHeight: true})(ResponsiveGrid)