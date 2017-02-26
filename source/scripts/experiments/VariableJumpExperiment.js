import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class ActionExperiment extends Experiment {
    constructor() {
        super()

        this.addChild(new Ground())
        this.addChild(new Hero())
    }
    get description() {
        return "... "
             + "... "
             + "...!"
    }
}

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.idle.png"), false, Pixi.SCALE_MODES.NEAREST)

class Hero extends Sprite {
    constructor() {
        super(HERO_TEXTURE)

        this.position.x = 320 / 4
        this.position.y = 180 - 32

        this.velocity = new Pixi.Point()

        this.speed = 2

        this.scale.x *= -1

        this.gravity = 0.5
        this.gravityDampener = 0.32
        this.gravityDampeningThreshold = -5
        this.jumpForce = -6.5
    }
    update(delta) {
        if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
            this.velocity.x = -1 * this.speed
            this.scale.x = +1
        }

        if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
            this.velocity.x = +1 * this.speed
            this.scale.x = -1
        }

        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            if(this.isGrounded()) {
                this.velocity.y += this.jumpForce
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.x *= 0.8

        //Gravity
        if(!this.isGrounded()) {
            //console.log(this.velocity.y < this.gravityDampeningThreshold)
            if(this.velocity.y < this.gravityDampeningThreshold && (Keyb.isDown("W") || Keyb.isDown("<up>"))) {
                this.velocity.y += this.gravity * this.gravityDampener * delta.f
            } else {
                this.velocity.y += this.gravity * delta.f
            }
        } else {
            this.velocity.y = 0
            this.position.y = 180-32
        }

        if(this.position.x < 0) {
            this.position.x = 0
        } if(this.position.x > 320) {
            this.position.x = 320
        }
    }
    isGrounded() {
        if(this.position.y >= 180 - 32) {
            return true
        } else {
            return false
        }
    }
}

class Ground extends Sprite {
    constructor() {
        super()

        this.anchor.x = 0
        this.scale.x = 320

        this.anchor.y = 1
        this.position.y = 180

        this.tint = 0x888888
    }
}
