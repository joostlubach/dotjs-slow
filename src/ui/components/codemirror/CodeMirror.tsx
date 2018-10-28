import React from 'react'
import {jss, fonts} from '@ui/styles'
import CodeMirrorClass, {EditorFromTextArea} from 'codemirror'
import {Editor as CMEditor, EditorChangeLinkedList, Doc as CMDoc} from 'codemirror'
import {Provider} from './context'
import Gutter from './Gutter'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/zenburn.css'

export interface Props {
  mode:        string
  theme?:      string
  options?:    AnyObject
  autoFocus?:  boolean

  value:      string
  onChange:   (value: string, change: EditorChangeLinkedList, document: CMDoc) => any

  onCodeMirrorSetUp?: (codeMirror: CMEditor) => any
  onValueSet?:        (value: string, document: CMDoc) => any

  children?:   React.ReactNode
  classNames?: React.ClassNamesProp
}

export const defaultTheme = 'monokai'

export const defaultOptions = {
  lineNumbers: true
}

interface State {
  codeMirror: EditorFromTextArea | null
}

export default class CodeMirror extends React.Component<Props, State> {

  //------
  // Properties

  public state: State = {
    codeMirror: null
  }

  private currentValue: string = ''

  private textArea: HTMLTextAreaElement | null = null
  private textAreaRef = (el: HTMLTextAreaElement | null) => { this.textArea = el }

  private get options() {
    const {options, theme = defaultTheme} = this.props

    return {
      ...defaultOptions,
      ...options,
      theme,
      gutters: this.gutters
    }
  }

  private get gutters(): string[] {
    const gutters: string[] = []
    React.Children.forEach(this.props.children, child => {
      if (!React.isValidElement(child)) { return }
      if (child.type !== Gutter as any) { return }

      const gutterProps = child.props as Gutter['props']
      gutters.push(gutterProps.name)
    })
    return gutters
  }

  //------
  // Loading

  private load(value: string) {
    const {codeMirror} = this.state
    if (codeMirror == null) { return }

    codeMirror.setValue(value)
  }

  //------
  // Set up & destroy

  private setupCodeMirror() {
    if (this.textArea == null) {
      throw new Error('setupCodeMirror called before mount')
    }

    const codeMirror = CodeMirrorClass.fromTextArea(this.textArea, this.options)
    codeMirror.on('change', this.onChange)
    this.setState({codeMirror: codeMirror})

    if (this.props.onCodeMirrorSetUp) {
      this.props.onCodeMirrorSetUp(codeMirror)
    }
    return codeMirror
  }

  private destroyCodeMirror() {
    if (this.state.codeMirror == null) { return }

    this.state.codeMirror.toTextArea()
  }

  private updateValue(value: string) {
    if (value === this.currentValue) { return }
    this.setValue(value)
  }

  private setValue(value: string, codeMirror: CMEditor | null = this.state.codeMirror) {
    if (codeMirror == null) { return }

    codeMirror.setValue(value)
    this.currentValue = value

    if (this.props.onValueSet) {
      this.props.onValueSet(value, codeMirror.getDoc())
    }
  }

  //------
  // Component lifecycle

  public componentDidMount() {
    const codeMirror = this.setupCodeMirror()
    this.setValue(this.props.value, codeMirror)
  }

  public componentWillUnmount() {
    this.destroyCodeMirror()
  }

  public componentWillReceiveProps(props: Props) {
    this.updateValue(props.value)
  }

  //------
  // Rendering

  public render() {
    const {classNames, children} = this.props
    const {codeMirror} = this.state

    return (
      <div classNames={[$.editor, classNames]}>
        <Provider value={codeMirror}>
          <textarea ref={this.textAreaRef}/>
          {codeMirror != null && children}
        </Provider>
      </div>
    )
  }

  //------
  // Events

  private onChange = (editor: CMEditor, change: EditorChangeLinkedList) => {
    if (change.origin === 'setValue') { return }

    const document = editor.getDoc()
    this.currentValue = document.getValue()
    this.props.onChange(this.currentValue, change, document)
  }

}

const $ = jss({
  editor: {
    '& .CodeMirror': {
      flex:       [1, 0, 0],
      fontSize:   '16px',
      lineHeight: fonts.codeLineHeight
    }
  }
})