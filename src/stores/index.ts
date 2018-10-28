// @index(!parameters): export {default as ${variable}} from ${relpath}
export {default as viewStateStore} from './viewStateStore'
// /index

// @index(!parameters): export * from ${relpath}
export * from './viewStateStore'
// /index

if (process.env.NODE_ENV === 'development') {
  Object.assign(window, {
    toJS:   require('mobx').toJS,
    stores: {
      // @index(!parameters): ${variable/Store$//}: |require(${relpath}).default,
      viewState: require('./viewStateStore').default,
      // /index
    }
  })
}