import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

var PIXEL = Pixi.Texture.fromImage(require("images/pixel.png"))

export default class HeroManaBar extends Container {
    constructor() {
        super()

        this.outerfill = new Pixi.Sprite(PIXEL)
        this.outerfill.tint = 0xFFFFFF
        this.outerfill.scale.x = 58
        this.outerfill.scale.y = 14

        this.innerfill = new Pixi.Sprite(PIXEL)
        this.innerfill.tint = 0x4A4A57
        this.innerfill.position.x = 1
        this.innerfill.position.y = 1
        this.innerfill.scale.x = 56
        this.innerfill.scale.y = 12

        this.addChild(this.outerfill)
        this.addChild(this.innerfill)

        for(var i = 0; i < 3; i += 1) {
            var bar = this.addChild(new Pixi.Sprite(PIXEL))

            bar.tint = 0x316CC8
            bar.position.x = 3 + (i * (16 + 2))
            bar.position.y = 3
            bar.scale.x = 16
            bar.scale.y = 8
        }

    }
}
