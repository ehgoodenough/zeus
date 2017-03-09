import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

var PIXEL = Pixi.Texture.fromImage(require("images/pixel.png"))

export default class HeroHealthBar extends Container {
    constructor() {
        super()

        this.position.x = 10
        this.position.y = 10

        var left = new BoxSprite()

        this.addChild(left)
    }
}

class BoxSprite extends Sprite {
    constructor() {
        super(PIXEL)

        this.scale.x = 16
        this.scale.y = 16
        this.anchor.x = 0
        this.anchor.y = 0

        this.tint = 0xFC3E2C
    }
}
