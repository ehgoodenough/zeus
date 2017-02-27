import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class ActionExperiment extends Experiment {
    constructor() {
        super()

        this.addChild(new Ground())
        this.theHero = new Hero()
        this.addChild(this.theHero)
        this.addChild(this.theHero.thePlatform)
    }
    get description() {
        return "A sprite that has a notion of velocity and acceleration. "
             + "It can jump to a multitude of altitudes, drift while airborne, "
             + "and make slight adjustments to its position while grounded."
    }
}

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.idle.png"), false, Pixi.SCALE_MODES.NEAREST)

class Hero extends Sprite {
    constructor() {
        super(HERO_TEXTURE)

        this.position.x = 320 / 4
        this.position.y = 0

        this.velocity = new Pixi.Point()

        this.groundSpeed = 2.8
        this.groundAcceleration = 0.4
        this.groundFriction = 0.32
        this.airSpeed = 2.8
        this.aerialAcceleration = 0.3
        this.aerialFriction = 0.05

        this.scale.x *= -1

        this.gravity = 0.65
        this.gravityDampener = 0.3
        this.gravityDampeningThreshold = -3.5
        this.jumpForce = -5.8
        this.minJumpHeight = 20
        this.groundedYPosition = 180 - 36
        this.lastGroundedYPosition = this.groundedYPosition

        this.thePlatform = new Platform()
    }
    update(delta) {
        var applyGroundedFriction = true
        var applyAerialFriction = true
        var jumpedSinceGrounded = false

        if(this.position.x > this.thePlatform.position.x - this.thePlatform.scale.x/2
        && this.position.x < this.thePlatform.position.x + this.thePlatform.scale.x/2) {
            if(this.position.y < this.thePlatform.position.y - 24) {
                this.groundedYPosition = this.thePlatform.position.y - 24
            }
        } else {
            this.groundedYPosition = 180 - 36
        }

        if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
            if(this.isGrounded()) {
                this.scale.x = +1
                if(this.velocity.x > -1 * this.groundSpeed) {
                    this.velocity.x -= this.groundAcceleration
                    if(this.velocity.x < -1 * this.groundSpeed) {
                        this.velocity.x = -1 * this.groundSpeed
                    }
                    applyGroundedFriction = false
                }
            } else if(this.velocity.x > -1 * this.airSpeed) {
                this.velocity.x -= this.aerialAcceleration
                if(this.velocity.x < -1* this.airSpeed) {
                    this.velocity.x = -1 * this.airSpeed
                }
                applyAerialFriction = false
            }
        }

        if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
            if(this.isGrounded()) {
                this.scale.x = -1
                if(this.velocity.x < +1 * this.groundSpeed) {
                    this.velocity.x += this.groundAcceleration
                    if(this.velocity.x > +1 * this.groundSpeed) {
                        this.velocity.x = +1 * this.groundSpeed
                    }
                    applyGroundedFriction = false
                }
            } else {
                if(this.velocity.x < this.airSpeed) {
                    this.velocity.x += this.aerialAcceleration
                    if(this.velocity.x > +1 * this.airSpeed) {
                        this.velocity.x = +1 * this.airSpeed
                    }
                    applyAerialFriction = false
                }
            }
        }

        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            if(this.isGrounded()) {
                this.velocity.y += this.jumpForce
                this.lastGroundedYPosition = this.position.y
                jumpedSinceGrounded = true
            }
        }

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Horizontal Friction
        if(this.isGrounded() && applyGroundedFriction) {
            this.velocity.x *= (1 - this.groundFriction)
        }
        if(!this.isGrounded() && applyAerialFriction) {
            this.velocity.x *= (1 - this.aerialFriction)
        }

        //Gravity
        if(!this.isGrounded()) {
            if(this.velocity.y < this.gravityDampeningThreshold &&
                (Keyb.isDown("W") || Keyb.isDown("<up>")) ||
                (this.lastGroundedYPosition - this.position.y < this.minJumpHeight
                && jumpedSinceGrounded)) {
                //If anything else ever causes the character to move upward
                //We may need to make sure that this gravity dampening
                //Only happens during a jump action
                this.velocity.y += this.gravity * this.gravityDampener * delta.f
            } else {
                this.velocity.y += this.gravity * delta.f
            }
        } else {
            this.velocity.y = 0
            this.position.y = this.groundedYPosition
            jumpedSinceGrounded = false
        }

        if(this.position.x < 0) {
            this.position.x = 0
        } if(this.position.x > 320) {
            this.position.x = 320
        }
    }
    isGrounded() {
        if(this.position.y >= this.groundedYPosition) {
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

class Platform extends Sprite {
    constructor() {
        super()

        this.anchor.x = 0.5
        this.scale.x = 40
        this.position.x = 80

        this.anchor.y = 1
        this.scale.y = 4
        this.position.y = 130

        this.tint = 0x888888
    }
}
