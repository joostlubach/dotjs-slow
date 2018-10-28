import * as React from 'react'
import {observer} from 'mobx-react'
import {CodeMirror, Marker, Gutter, GutterMarker, LineWidget, LineClass} from '@ui/components/codemirror'
import {jss, jssKeyframes, colors, layout, fonts} from '@ui/styles'
import {programStore, simulatorStore} from '@src/stores'
import {CodeError} from '@src/program'
import {Position} from 'estree'
import {Editor as CMEditor, EditorChange, Doc as CMDoc, Position as CMPosition} from 'codemirror'

import 'codemirror/mode/javascript/javascript'

export interface Props {
  classNames?: React.ClassNamesProp
}

interface State {
  focusedErrorLine: number | null,
  readOnlyRanges:   Array<{fromLine: number, toLine: number}>,
  hiddenRanges:     Range[],
  codeMirror:       CMEditor | null,
}

export interface Range {
  from: {line: number, ch: number},
  to:   {line: number, ch: number}
}

@observer
export default class CodeEditor extends React.Component<Props, State> {

  public state: State = {
    focusedErrorLine: null,
    readOnlyRanges:   [],
    hiddenRanges:     [],
    codeMirror:       null
  }

  //------
  // Methods

  private toggleFocusedErrorLine(line: number) {
    if (this.state.focusedErrorLine === line) {
      this.setState({focusedErrorLine: null})
    } else {
      this.setState({focusedErrorLine: line})
    }
  }

  //------
  // Rendering

  public render() {
    const {classNames} = this.props
    const hasErrors = programStore.errors.length > 0

    return (
      <CodeMirror
        classNames={[$.codeEditor, hasErrors && $.withErrors, classNames]}
        mode='javascript'
        value={programStore.customerCode}
        onChange={this.onEditorChange}

        onCodeMirrorSetUp={cm => { this.setState({codeMirror: cm}) }}

        options={{
          cursorScrollMargin: 50
        }}
      >
        {this.renderCurrentStepMarker()}
        {this.renderErrorMarkers()}
        {this.renderFocusedErrorLineWidgets()}

        <Gutter name='errors'>
          {this.renderErrorGutterMarkers()}
        </Gutter>
      </CodeMirror>
    )
  }

  //------
  // Current line

  private renderCurrentStepMarker() {
    const {currentStep, done} = simulatorStore
    if (currentStep == null || done) { return null }

    const {codeLocation} = currentStep
    if (codeLocation == null) { return null }

    return (
      <Marker
        from={positionToCodeMirrorLocation(codeLocation.start)}
        to={positionToCodeMirrorLocation(codeLocation.end)}
        classNames={$.currentStep}
      />
    )
  }

  //------
  // Errors

  private renderErrorMarkers() {
    return programStore.errors.map((error, index) => {
      return this.renderErrorMarker(error, index)
    })
  }

  private renderErrorMarker(error: CodeError, index: number) {
    const loc = getErrorLocation(error)
    if (loc == null) { return null }

    return (
      <Marker
        key={index}
        from={loc.from}
        to={loc.to}
        classNames={[$.errorMarker, loc.empty && $.emptyErrorMarker]}
      />
    )
  }

  private renderErrorGutterMarkers() {
    const lines = new Set()
    for (const error of programStore.errors) {
      const loc = getErrorLocation(error)
      if (loc == null) { continue }

      for (let ln = loc.from.line; ln <= loc.to.line; ln++) {
        lines.add(ln)
      }
    }

    return Array.from(lines).map(line => {
      return (
        <GutterMarker
          key={line}
          line={line}
          classNames={$.errorGutterMarker}
          onTap={this.onErrorGutterMarkerTap.bind(this, line)}
        />
      )
    })
  }

  private renderFocusedErrorLineWidgets() {
    const {focusedErrorLine: line} = this.state
    if (line == null) { return null }

    const errors = programStore.errors.filter(err => {
      const loc = getErrorLocation(err)
      if (loc == null) { return false }

      return loc.from.line <= line && loc.to.line >= line
    })
    return errors.map((error, index) => {
      return (
        <LineWidget key={`${line}-${index}`} line={line} classNames={$.errorLineWidget}>
          <div>{error.message}</div>
        </LineWidget>
      )
    })
  }

  //------
  // Events

  private onEditorChange = (value: string, change: EditorChange, doc: CMDoc) => {
    programStore.customerCode = value
    programStore.errors = []

    simulatorStore.reset()
  }

  private onErrorGutterMarkerTap = (line: number) => {
    this.toggleFocusedErrorLine(line)
  }

}

function positionToCodeMirrorLocation(position: Position) {
  return {line: position.line - 1, ch: position.column}
}

function getErrorLocation(error: CodeError): {from: CMPosition, to: CMPosition, empty: boolean} | null {
  const {loc} = error
  if (loc == null) { return null }

  const {start, end} = loc
  const empty = start.line === end.line && start.column === end.column

  const from = {line: start.line - 1, ch: start.column}
  const to = {line: end.line - 1, ch: empty ? end.column + 1 : end.column}

  return {from, to, empty}
}

const errorAnim = jssKeyframes('error', {
  '0%':   {animationTimingFunction: 'ease-out'},
  '50%':  {backgroundColor: colors.error.alpha(0.05).string(), animationTimingFunction: 'ease-in'},
  '100%': {},
})

const $ = jss({
  codeEditor: {
    ...layout.flex.column,

    '& .CodeMirror-gutter.errors': {
      width: 12
    },
  },

  withErrors: {
    '& .CodeMirror': {
      animation: `${errorAnim} 1s linear infinite`
    }
  },

  currentStep: {
    background: colors.blue
  },

  readOnlyLine: {
    backgroundColor: colors.blue.alpha(0.2)
  },

  errorGutterMarker: {
    width:        10,
    height:       10,
    borderRadius: 5,

    border:      [1, 'solid', 'white'],
    background:  colors.error,

    cursor: 'pointer'
  },

  errorMarker: {
    background:   colors.error.alpha(0.1),
    borderBottom: [1, 'dashed', colors.error]
  },

  emptyErrorMarker: {
    position:     'relative',
    background:   'none',
    borderBottom: 'none',

    // Make a small triangle.
    '&::after': {
      position: 'absolute',
      display:  'block',
      content:  '""',

      left:     -4,
      bottom:   -1,
      width:    0,
      height:   0,

      border:            [4, 'solid', colors.transparent],
      borderBottomColor: colors.error
    }
  },

  errorLineWidget: {
    border:      [1, 'solid', colors.error],
    borderWidth: `1px 0`,
    background:  colors.error.alpha(0.6),
    color:       colors.fg.normal,
    font:        fonts.normal,
    padding:     [2, layout.padding.s]
  }
})