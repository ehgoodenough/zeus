import Keyb from "keyb"
import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.idle.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class Hero extends Sprite {
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
        this.lastGroundedYPosition = Infinity
        this.currentPlatform = null
        this.feetOffset = 19
        this.hasJumpedSinceGrounded = true
    }
    update(delta) {
        var applyGroundedFriction = true
        var applyAerialFriction = true

        if(!((Keyb.isDown("A") || Keyb.isDown("<left>"))
        && (Keyb.isDown("D") || Keyb.isDown("<right>")))) {
            if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
                if(this.isGrounded) {
                    this.scale.x = +1
                    if(this.velocity.x >= -1 * this.groundSpeed) {
                        this.velocity.x -= this.groundAcceleration * delta.f
                        applyGroundedFriction = false
                    }
                    if(this.velocity.x < -1 * this.groundSpeed) {
                        this.velocity.x = -1 * this.groundSpeed
                    }
                } else {
                    if(this.velocity.x > -1 * this.airSpeed) {
                        this.velocity.x -= this.aerialAcceleration * delta.f
                        applyAerialFriction = false
                    }
                    if(this.velocity.x < -1* this.airSpeed) {
                        this.velocity.x = -1 * this.airSpeed
                    }
                }
            }
            if(Keyb.isDown("D") || Keyb.isDown("<right>")) {
                if(this.isGrounded) {
                    this.scale.x = -1
                    if(this.velocity.x <= +1 * this.groundSpeed) {
                        this.velocity.x += this.groundAcceleration * delta.f
                        applyGroundedFriction = false
                    }
                    if(this.velocity.x > +1 * this.groundSpeed) {
                        this.velocity.x = +1 * this.groundSpeed
                    }
                } else {
                    if(this.velocity.x < this.airSpeed) {
                        this.velocity.x += this.aerialAcceleration * delta.f
                        applyAerialFriction = false
                    }
                    if(this.velocity.x > +1 * this.airSpeed) {
                        this.velocity.x = +1 * this.airSpeed
                    }
                }
            }
        }
        if(this.isGrounded) {
            this.hasJumpedSinceGrounded = false
        }

        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            if(this.isGrounded) {
                this.velocity.y += this.jumpForce
                this.lastGroundedYPosition = this.position.y
                this.hasJumpedSinceGrounded = true
            }
        }

        if(Keyb.isDown("S") || Keyb.isDown("<down>")) {
            if(this.isGrounded && this.currentPlatform.isPermeable) {
                this.currentPlatform = null
            }
        }

        //Horizontal Friction
        if(this.isGrounded && applyGroundedFriction) {
            this.velocity.x *= (1 - this.groundFriction)
        }
        if(!this.isGrounded && applyAerialFriction) {
            this.velocity.x *= (1 - this.aerialFriction)
        }

        //Gravity
        if(!this.isGrounded) {
            if(this.velocity.y < this.gravityDampeningThreshold &&
                ((Keyb.isDown("W") || Keyb.isDown("<up>")) ||
                (this.position.y >= this.lastGroundedYPosition - this.minJumpHeight
                && this.position.y <= this.lastGroundedYPosition))) {
                //If anything else ever causes the character to move upward
                //We may need to make sure that this gravity dampening
                //Only happens during a jump action
                this.velocity.y += this.gravity * this.gravityDampener * delta.f
            } else {
                this.velocity.y += this.gravity * delta.f
            }
        }

        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        if(this.isGrounded) {
            this.velocity.y = 0
            this.position.y = this.currentPlatform.getTopYAtX(this.position.x) - this.feetOffset
            this.lastGroundedYPosition = this.position.y
        }

        if(this.position.x < 0) {
            this.position.x = 0
        } if(this.position.x > 320) {
            this.position.x = 320
        }
    }
    get isGrounded() {
        if(this.currentPlatform === null) {
            return false
        }
        if(this.position.y >= this.currentPlatform.getTopYAtX(this.position.x) - this.feetOffset) {
            return true
        } else {
            return false
        }
    }
}
