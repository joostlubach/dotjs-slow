interface Intercom {
  (method: string, args?: Record<string, any>): any
}

declare const Intercom: Intercom

interface Window {
  Intercom?: Intercom
}