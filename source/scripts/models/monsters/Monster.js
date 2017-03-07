import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"

var WOLF_TEXTURE = Pixi.Texture.fromImage(require("images/wolf.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class Monster extends Sprite {
    constructor() {
        super(WOLF_TEXTURE)

        this.position.x = 240
        this.position.y = 160

        this.anchor.x = 0.5
        this.anchor.y = 1

        this.state = "PROWL"
        this.speed = 1
    }
    update(delta) {
        if(this.state === "PROWL") {
            var distance = this.origin.hero.position.x - this.position.x
            var direction = distance < 0 ? -1 : +1

            this.position.x += this.speed * direction * delta.f
            this.direction = direction
        } else if(this.state === "STRIKE") {
            //
        } else if(this.state === "HOWL") {
            //
        } else if(this.state === "CHARGE") {
            // sometimes, the wolf should just randomly charge in.
        }
    }
}

// retreating speed should be slower
// should always face the player when prowling
// when prowling, looks for times to strike, let player back turned.
