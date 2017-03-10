import Keyb from "keyb"
import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"
import Input from "scripts/layers/Input.js"

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.idle.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class Hero extends Sprite {
    constructor() {
        super(HERO_TEXTURE)

        this.position.x = 0
        this.position.y = 40

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
        this.headOffset = 22

        this.moveState = "airborne"

        this.inputs = {
            up: new Input(["W", "<up>"]),
            down: new Input(["S", "<down>"]),
            left: new Input(["A", "<left>"]),
            right: new Input(["D", "<right>"]),
        }

        this.maxhealth = 80
        this.health = 60
    }
    groundedUpdate(delta) {
        //Check horizontal inputs, add x velocity accordingly
        if(this.inputs.right.isDown() && !this.inputs.left.isDown()) {
            this.direction = +1
            this.velocity.x += this.groundAcceleration * delta.f
            this.velocity.x = Math.min(this.velocity.x, this.groundSpeed)
        }
        if(this.inputs.left.isDown() && !this.inputs.right.isDown()) {
            this.direction = -1
            this.velocity.x -= this.groundAcceleration * delta.f
            this.velocity.x = Math.max(this.velocity.x, -this.groundSpeed)
        }
        //Translate
        this.position.x += this.velocity.x * delta.f
        if(this.currentPlatform.getTopYAtX(this.position.x) !== null) {
            this.position.y = this.currentPlatform.getTopYAtX(this.position.x)
            - this.feetOffset
        }
        //Apply Friction
        if(!this.inputs.left.isDown() && !this.inputs.right.isDown()) {
            this.velocity.x *= (1 - this.groundFriction)
        }

        //Check if state needs to change
        if(this.inputs.up.isDown()) {
            this.velocity.y = this.jumpForce
            this.moveState = "airborne"
            this.lastGroundedYPosition = this.position.y
        } else {
            var minX = this.currentPlatform.position.x - this.currentPlatform.spriteWidth/2
            var maxX = this.currentPlatform.position.x + this.currentPlatform.spriteWidth/2
            if(this.position.x <= minX || this.position.x >= maxX) {
                var lastPlatform = this.currentPlatform
                var currentPlatform = this.collisionManager.getLanding()
                if(currentPlatform && lastPlatform.getTopYAtX(this.position.x)
                >= currentPlatform.getTopYAtX(this.position.x)) {
                    this.position.y = currentPlatform.getTopYAtX(this.position.x)
                    - this.feetOffset
                    this.currentPlatform = currentPlatform
                } else {
                    this.velocity.y = 0
                    this.moveState = "airborne"
                }
            }
        }
        if(this.inputs.down.isDown() && this.currentPlatform.attributes.isPermeable) {
            this.velocity.y = 0
            this.position.y += (this.collisionManager.fallthroughBuffer + .00000001)
            this.moveState = "airborne"
            this.currentPlatform = null
        }
    }
    airborneUpdate(delta) {
        this.currentPlatform = this.collisionManager.getLanding()
        var ceilingPlatform = this.collisionManager.getCeiling()

        //Check horizontal inputs, add x velocity accordingly
        if(this.inputs.left.isDown() && !this.inputs.right.isDown()) {
            this.velocity.x -= this.aerialAcceleration * delta.f
            this.velocity.x = Math.max(this.velocity.x, -this.airSpeed)
        }
        if(this.inputs.right.isDown() && !this.inputs.left.isDown()) {
            this.velocity.x += this.aerialAcceleration * delta.f
            this.velocity.x = Math.min(this.velocity.x, this.airSpeed)
        }

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

        if(ceilingPlatform && this.position.y + this.velocity.y
        < ceilingPlatform.getBottomYAtX(this.position.x) + this.headOffset
        && !ceilingPlatform.attributes.isPermeable) {
            this.position.y = ceilingPlatform.getBottomYAtX(this.position.x)
            + this.headOffset - this.velocity.y
            this.velocity.y *= 0.9
        }

        //Translate
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        //Apply friction
        if(!this.inputs.left.isDown() && !this.inputs.right.isDown()) {
            this.velocity.x *= (1 - this.aerialFriction)
        }

        //Check if state needs to change
        if(this.currentPlatform && this.position.y + this.feetOffset
            > this.currentPlatform.getTopYAtX(this.position.x)) {
            if(this.currentPlatform.getTopYAtX(this.position.x) !== null) {
                this.position.y = this.currentPlatform.getTopYAtX(this.position.x)
                - this.feetOffset
                this.moveState = "grounded"
            }
        }
    }
    update(delta) {
        if(this.moveState === "airborne") {
            this.airborneUpdate(delta)
        } else if( this.moveState === "grounded") {
            this.groundedUpdate(delta)
        }
    }
}
