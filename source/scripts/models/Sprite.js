import * as Pixi from "pixi.js"

var DEFAULT_TEXTURE = Pixi.Texture.fromImage(require("images/pixel.png"))

export default class Sprite extends Pixi.Sprite {
    constructor(texture) {
        super(texture || DEFAULT_TEXTURE)

        if(texture == undefined) {
            this.scale.x = 16
            this.scale.y = 16
        }

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
        this.scale.x = direction * -1
    }
}
