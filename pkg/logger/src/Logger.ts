// tslint:disable no-console

import {LogLevel, Details, LogListener, Subscription, Message, StyledMessage, Styles} from './types'
import dumpStyles from './dumpStyles'

export default class Logger {

  constructor(component: string) {
    this.component = component
  }

  public component: string

  //------
  // Static interface

  public static info(component: string, message: Message, details?: Details) {
    new this(component).info(message, details)
  }

  public static warning(component: string, message: Message, details?: Details) {
    new this(component).warning(message, details)
  }

  public static error(component: string, message: Message, details?: Details) {
    new this(component).error(message, details)
  }

  //------
  // Interface

  public info(message: Message, details?: Details) {
    this.log('info', message, details)
  }

  public warning(message: Message, details?: Details) {
    this.log('warning', message, details)
  }

  public error(message: Message, details?: Details) {
    this.log('error', message, details)
  }

  //------
  // Look hooks

  private static listeners: Set<LogListener> = new Set()

  public static addListener(listener: LogListener): Subscription {
    this.listeners.add(listener)

    return {
      remove: () => {
        this.listeners.delete(listener)
      }
    }
  }

  protected emit(level: LogLevel, message: Message, details?: Details) {
    const text = typeof message === 'string'
      ? message
      : message.text

    for (const listener of Logger.listeners) {
      listener(this.component, level, text, details)
    }
  }

  //------
  // Log

  public log(level: LogLevel, message: Message, details?: Details) {
    const args = this.formatMessage(level, message)

    if (details == null) {
      // Just log the formatted message.
      console.log(...args)
    } else if (console.groupCollapsed instanceof Function) {
      // Use the group feature to log the details.
      console.groupCollapsed(...args)
      this.logDetails(details)
      console.groupEnd()
    } else {
      console.log(...args)
      this.logDetails(details)
    }

    // Emit the log message.
    const plain = typeof message === 'string' ? message : message.text
    this.emit(level, plain, details)
  }

  protected logDetails(details: Details) {
    if (details instanceof Array) {
      details.forEach(this.logDetails.bind(this))
    } else if (details instanceof Object && details.text != null && details.style != null) {
      console.log(...this.formatDetail(details.text, details.style))
    } else {
      console.log(details)
    }
  }

  protected formatMessage(level: LogLevel, message: Message): string[] {
    const styles = {}
    if (isStyledMessage(message)) {
      Object.assign(styles, message.styles)
      message = message.text
    }

    if (!(console.groupCollapsed instanceof Function)) {
      // No coloring is supported either.
      return [`[${this.component}] ${level.toUpperCase()}: ${message}`]
    } else {
      return [
        `%c[${this.component}] %c${message}`,
        'font-weight: bold;',
        `font-weight: normal; ${dumpStyles({...this.stylesForLevel(level), ...styles})}`
      ]
    }
  }

  protected formatDetail(text: string, style: string): string[] {
    if (!(console.groupCollapsed instanceof Function)) {
      // No coloring is supported either.
      return [text]
    } else {
      return [`%c${text}`, style]
    }
  }

  protected stylesForLevel(level: LogLevel): Styles {
    switch (level) {
    case 'info':    return {color: '#3887D3'}
    case 'warning': return {backgroundColor: 'yellow'}
    case 'error':   return {color: 'red'}
    default:        return {}
    }
  }

}

function isStyledMessage(message: Message): message is StyledMessage {
  return typeof message !== 'string'
}