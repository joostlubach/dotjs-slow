import {observable, autorun} from 'mobx'
import {Sizes as PanelSizes} from '@ui/components/Panels'

export class ViewStateStore {

  constructor() {
    this.load()
    autorun(() => this.save())
  }

  @observable
  public panelSizes: PanelSizes = {
    right: window.innerWidth * 0.4,
  }

  public load() {
    const json = window.localStorage.viewState || '{}'
    Object.assign(this, JSON.parse(json))
  }

  public save() {
    const config = {
      panelSizes: this.panelSizes,
    }
    window.localStorage.viewState = JSON.stringify(config)
  }

}

export default new ViewStateStore()