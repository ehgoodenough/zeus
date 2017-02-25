import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class InputPollingExperiment extends Experiment {
    constructor() {
        super()

        this.addChild(new Hero())
    }
    get description() {
        return "A sprite that can be moved via keyboard input. Use the arrow "
             + "keys or WASD to move the sprite around the screen. It does not "
             + "have any notion of velocity or acceleration; just translation."
    }
}

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.idle.png"), false, Pixi.SCALE_MODES.NEAREST)

class Hero extends Sprite {
    constructor() {
        super(HERO_TEXTURE)

        this.position.x = 320 / 2
        this.position.y = 180 / 2

        this.speed = 2
    }
    update(delta) {
        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            this.position.y -= this.speed * delta.f
            if(this.position.y < 0) {
                this.position.y = 0
            }
        }

        if(Keyb.isDown("S") || Keyb.isDown("<down>")) {
            this.position.y += this.speed * delta.f
            if(this.position.y > 180) {
                this.position.y = 180
            }
        }

        if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
            this.position.x -= this.speed * delta.f
            if(this.position.x < 0) {
                this.position.x = 0
            }
        }

        if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
            this.position.x += this.speed * delta.f
            if(this.position.x > 320) {
                this.position.x = 320
            }
        }

    }
}
