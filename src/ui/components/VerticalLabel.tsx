import * as React from 'react'
import {jss} from '@ui/styles'
import {Label, LabelProps} from '@ui/components'
import sizeMe, {SizeMeProps} from 'react-sizeme'
import {omit} from 'lodash'

export interface Props extends LabelProps {
  labelClassNames?: React.ClassNamesProp
}

interface State {
  width:  number | null
  height: number | null
}

export default class VerticalLabel extends React.Component<Props, State> {

  public state: State = {
    width:  null,
    height: null
  }

  public render() {
    const {classNames, labelClassNames, ...rest} = this.props
    const width = this.state.width || 0
    const height = this.state.height || 0

    const style: React.CSSProperties = {
      width:    width || undefined,
      height:   height || undefined,
    }

    const labelStyle: React.CSSProperties = {
      visibility: this.state.width != null ? 'visible' : 'hidden',
      transform:  `rotateZ(-90deg) translate(${(width - height) / 2}px, ${(width - height) / 2}px)`
    }

    return (
      <div classNames={[$.verticalLabel, classNames]} style={style}>
        <div classNames={$.label} style={labelStyle}>
          <SizedLabel
            classNames={labelClassNames}
            onSizeChanged={this.onSizeChanged}
            {...rest}
          />
        </div>
      </div>
    )
  }

  private onSizeChanged = (size: Size) => {
    this.setState(size)
  }

}

type SizedLabelProps = Props & SizeMeProps & {onSizeChanged: (size: Size) => any}

const SizedLabel = sizeMe({monitorWidth: true, monitorHeight: true})(class extends React.Component<SizedLabelProps> {

  public componentDidUpdate(prevProps: SizedLabelProps) {
    if (prevProps.size.width !== this.props.size.width || prevProps.size.height !== this.props.size.height) {
      this.props.onSizeChanged(this.props.size as Size)
    }
  }

  public render() {
    const labelProps = omit(this.props, 'size')
    return <Label {...labelProps}/>
  }

})

const $ = jss({
  verticalLabel: {
    position: 'relative',
  },

  label: {
    position:  'absolute',
    top:       0,
    left:      0
  }
})