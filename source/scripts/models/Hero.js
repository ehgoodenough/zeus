import Keyb from "keyb"
import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Input from "scripts/layers/Input.js"

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

        this.direction = +1

        this.gravity = 0.65
        this.gravityDampener = 0.3
        this.gravityDampeningThreshold = -3.5
        this.jumpForce = -5.8
        this.minJumpHeight = 20
        this.lastGroundedYPosition = Infinity
        this.currentPlatform = null
        this.feetOffset = 19

        this.inputs = {
            up: new Input(["W", "<up>"]),
            down: new Input(["S", "<down>"]),
            left: new Input(["A", "<left>"]),
            right: new Input(["D", "<right>"]),
        }

        this.maxhealth = 80
        this.health = this.maxhealth
    }
    update(delta) {
        if(this.isGrounded) {
            if(this.inputs.left.isDown() && !this.inputs.right.isDown()) {
                this.direction = -1
                this.velocity.x -= this.groundAcceleration * delta.f
                this.velocity.x = Math.max(this.velocity.x, -this.groundSpeed)
            }
        } else {
            if(this.inputs.left.isDown() && !this.inputs.right.isDown()) {
                this.velocity.x -= this.aerialAcceleration * delta.f
                this.velocity.x = Math.max(this.velocity.x, -this.airSpeed)
            }
        }

        if(this.isGrounded) {
            if(this.inputs.right.isDown() && !this.inputs.left.isDown()) {
                this.direction = +1
                this.velocity.x += this.groundAcceleration * delta.f
                this.velocity.x = Math.min(this.velocity.x, this.groundSpeed)
            }
        } else {
            if(this.inputs.right.isDown() && !this.inputs.left.isDown()) {
                this.velocity.x += this.aerialAcceleration * delta.f
                this.velocity.x = Math.min(this.velocity.x, this.airSpeed)
            }
        }

        if(this.isGrounded) {
            this.hasJumpedSinceGrounded = false
        }

        if(this.isGrounded) {
            if(this.inputs.up.isDown()) {
                this.velocity.y += this.jumpForce
                this.lastGroundedYPosition = this.position.y
                this.hasJumpedSinceGrounded = true
            }
        }

        if(this.isGrounded) {
            if(this.inputs.down.isDown()) {
                if(this.currentPlatform.isPermeable) {
                    this.currentPlatform = null
                }
            }
        }

        // WE SHOULD CONSIDER MOVING THE FOLLOWING
        // SECTIONS, FRICTON AND GRAVITY, AFTER THE
        // TRANSLATION SECTION. BUT DOING SO DOES
        // CHANGE THE PHYSICS, SO I'M NOT TOUCHING
        // IT RIGHT NOW.

        // Applying friction to horizontal movement.
        if(this.isGrounded) {
            if(!this.inputs.left.isDown() && !this.inputs.right.isDown()) {
                this.velocity.x *= (1 - this.groundFriction)
            }
        } else {
            if(!this.inputs.left.isDown() && !this.inputs.right.isDown()) {
                this.velocity.x *= (1 - this.aerialFriction)
            }
        }

        // Applying gravity to velocity.
        if(!this.isGrounded) {
            if(this.velocity.y < this.gravityDampeningThreshold
            && (this.inputs.up.isDown()
            || (this.position.y >= this.lastGroundedYPosition - this.minJumpHeight
            && this.position.y <= this.lastGroundedYPosition))) {
                // If anything else ever causes the character to move upward
                // We may need to make sure that this gravity dampening
                // Only happens during a jump action
                this.velocity.y += this.gravity * this.gravityDampener * delta.f
            } else {
                this.velocity.y += this.gravity * delta.f
            }
        }

        // Translation via velocity
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        // Move along the world.
        if(this.isGrounded && this.currentPlatform) {
            this.velocity.y = 0
            this.position.y = this.currentPlatform.getTopYAtX(this.position.x) - this.feetOffset
            this.lastGroundedYPosition = this.position.y
        }

        // Collide with the edges of the screen.
        // if(this.position.x < 0) {
        //     this.position.x = 0
        // } if(this.position.x > 320) {
        //     this.position.x = 320
        // }
    }
    get isGrounded() {
        if(this.currentPlatform === null) {
            return false
        }
        if(this.currentPlatform && this.position.y >= this.currentPlatform.getTopYAtX(this.position.x) - this.feetOffset) {
            return true
        } else {
            return false
        }
    }
}
