import * as Pixi from "pixi.js"

export default class Container extends Pixi.Container {
    get origin() {
        return this.parent ? this.parent.origin || this.parent : this
    }
}
