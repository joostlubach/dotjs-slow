import manager, {OpenPortal} from './manager'
import {isFunction} from 'lodash'

document.addEventListener('keydown', onKeyDown)
document.addEventListener('mousedown', onMouseDown)
document.addEventListener('touchstart', onMouseDown)

function onKeyDown(event: KeyboardEvent) {
  if (event.keyCode !== 27) { return }

  const {topMostPortal} = manager
  if (topMostPortal != null && topMostPortal.closeOnEscape) {
    topMostPortal.close()
  }
}

function onMouseDown(event: Event) {
  for (const portal of manager.openPortals) {
    if (portal.shouldCloseOnClick(event)) {
      portal.close()
    }
  }
}