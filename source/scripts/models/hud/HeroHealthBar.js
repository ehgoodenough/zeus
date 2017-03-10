import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

var PIXEL = Pixi.Texture.fromImage(require("images/pixel.png"))

export default class HeroHealthBar extends Container {
    constructor() {
        super()

        this.outerfill = new Pixi.Sprite(PIXEL)
        this.outerfill.tint = 0xFFFFFF
        this.outerfill.scale.x = 84
        this.outerfill.scale.y = 14

        this.innerfill = new Pixi.Sprite(PIXEL)
        this.innerfill.tint = 0x4A4A57
        this.innerfill.position.x = 1
        this.innerfill.position.y = 1
        this.innerfill.scale.x = 82
        this.innerfill.scale.y = 12

        this.bar = new Pixi.Sprite(PIXEL)
        this.bar.tint = 0x9F2E35
        this.bar.position.x = 2
        this.bar.position.y = 2
        this.bar.scale.x = 80
        this.bar.scale.y = 10

        this.addChild(this.outerfill)
        this.addChild(this.innerfill)
        this.addChild(this.bar)
    }
    update(delta) {
        if(this.origin.scene != undefined
        && this.origin.scene.hero != undefined) {
            var maxhealth = this.origin.scene.hero.maxhealth || 50
            var health = this.origin.scene.hero.health || 0

            if(health > maxhealth) {
                health = maxhealth
            }

            this.bar.scale.x = health
            this.innerfill.scale.x = maxhealth + 2
            this.outerfill.scale.x = maxhealth + 4
        }
    }
}
