import * as Pixi from "pixi.js"

export default class Sprite extends Pixi.Sprite {
    constructor(texture) {
        super(texture || Pixi.Texture.Empty)

        // By default, all sprites
        // should be anchored at
        // their centers.
        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
    get origin() {
        return this.parent ? this.parent.origin || this.parent : this
    }
    get direction() {
        return this.scale.x < 0 ? +1 : -1
    }
    set direction(direction) {
        direction = direction < 0 ? +1 : -1
        this.scale.x = Math.abs(this.scale.x) * direction
    }
}
