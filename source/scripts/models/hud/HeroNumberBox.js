import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

var PIXEL = Pixi.Texture.fromImage(require("images/pixel.png"))
var ZERO = Pixi.Texture.fromImage(require("images/zero.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class HeroNumberBox extends Container {
    constructor() {
        super()

        this.outerfill = new Pixi.Sprite(PIXEL)
        this.outerfill.tint = 0xFFFFFF
        this.outerfill.scale.x = 27
        this.outerfill.scale.y = 27

        this.innerfill = new Pixi.Sprite(PIXEL)
        this.innerfill.tint = 0x4A4A57
        this.innerfill.position.x = 1
        this.innerfill.position.y = 1
        this.innerfill.scale.x = 25
        this.innerfill.scale.y = 25

        this.text = new Pixi.Sprite(ZERO)
        this.text.position.x = 5
        this.text.position.y = 5

        this.addChild(this.outerfill)
        this.addChild(this.innerfill)
        this.addChild(this.text)
    }
}
