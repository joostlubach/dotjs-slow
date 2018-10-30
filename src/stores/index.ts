// @index(!parameters): export {default as ${variable}} from ${relpath}
export {default as musicStore} from './musicStore'
export {default as programStore} from './programStore'
export {default as simulatorStore} from './simulatorStore'
export {default as viewStateStore} from './viewStateStore'
// /index

// @index(!parameters): export * from ${relpath}
export * from './musicStore'
export * from './programStore'
export * from './simulatorStore'
export * from './viewStateStore'
// /index

if (process.env.NODE_ENV === 'development') {
  Object.assign(window, {
    toJS:   require('mobx').toJS,
    stores: {
      // @index(!parameters): ${variable/Store$//}: |require(${relpath}).default,
      music:     require('./musicStore').default,
      program:   require('./programStore').default,
      simulator: require('./simulatorStore').default,
      viewState: require('./viewStateStore').default,
      // /index
    }
  })
}