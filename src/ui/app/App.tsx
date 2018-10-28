import * as React from 'react'
import {jss} from '@ui/styles'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class App extends React.Component<Props> {

  public render() {
    return (
      <div classNames={[$.app, this.props.classNames]}>
        Hoi
      </div>
    )
  }

}

const $ = jss({
  app: {
  }
})