import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Container from "scripts/models/Container.js"

var PIXEL = Pixi.Texture.fromImage(require("images/pixel.png"))

export default class HeroHealthBar extends Container {
    constructor() {
        super()

        this.position.x = 10
        this.position.y = 10

        this.background1 = new BoxSprite()
        this.background1.tint = 0xFFFFFF
        this.background1.scale.x = 82
        this.background1.scale.y = 14

        this.background2 = new BoxSprite()
        this.background2.tint = 0x4A4A57
        this.background2.position.x = 1
        this.background2.position.y = 1
        this.background2.scale.x = 80
        this.background2.scale.y = 12

        this.bar = new BoxSprite()
        this.bar.tint = 0x9F2E35
        this.bar.position.x = 2
        this.bar.position.y = 2
        this.bar.scale.x = 78
        this.bar.scale.y = 10

        this.addChild(this.background1)
        this.addChild(this.background2)
        this.addChild(this.bar)
    }
    update(delta) {
        if(!!this.origin.scene && !!this.origin.scene.hero) {
            var maxhealth = this.origin.scene.hero.maxhealth || 50
            var health = this.origin.scene.hero.health || 0

            if(health > maxhealth) {
                health = maxhealth
            }

            this.bar.scale.x = health
            this.background2.scale.x = maxhealth + 2
            this.background1.scale.x = maxhealth + 4
        }
    }
}

class BoxSprite extends Sprite {
    constructor() {
        super(PIXEL)

        this.anchor.x = 0
        this.anchor.y = 0
    }
}
