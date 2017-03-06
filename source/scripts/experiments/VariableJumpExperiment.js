// THE EXPERIMENTS HAVE BEEN CONDUCTED, AND
// ARE NOW DEPRECATED. DO NOT EDIT THESE.

import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class ActionExperiment extends Experiment {
    constructor() {
        super()

        var theHero = this.addChild(new Hero())
        var theLevel = this.addChild(new Level())
        this.collisionManager = new CollisionManager(theHero, theLevel)

        this.children.reverse()
    }
    get description() {
        return "A sprite that has a notion of velocity and acceleration. "
             + "It can jump to a multitude of altitudes, drift while airborne, "
             + "and make slight adjustments to its position while grounded."
    }
    update(delta) {
        this.children.forEach(function(child) {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
        this.collisionManager.update()
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
        this.lastGroundedYPosition = Infinity
        this.currentPlatform = null
        this.feetOffset = 20
        this.hasJumpedSinceGrounded = true
    }
    update(delta) {
        var applyGroundedFriction = true
        var applyAerialFriction = true

        if(!((Keyb.isDown("A") || Keyb.isDown("<left>"))
        && (Keyb.isDown("D") || Keyb.isDown("<right>")))) {
            if(Keyb.isDown("A") || Keyb.isDown("<left>")) {
                if(this.isGrounded()) {
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
                if(this.isGrounded()) {
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
        if(this.isGrounded()) {
            this.hasJumpedSinceGrounded = false
        }

        if(Keyb.isDown("W") || Keyb.isDown("<up>")) {
            if(this.isGrounded()) {
                this.velocity.y += this.jumpForce
                this.lastGroundedYPosition = this.position.y
                this.hasJumpedSinceGrounded = true
            }
        }

        if(Keyb.isDown("S") || Keyb.isDown("<down>")) {
            if(this.isGrounded() && this.currentPlatform.isPermeable) {
                this.currentPlatform = null
            }
        }

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

        if(this.isGrounded()) {
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
    isGrounded() {
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

class Platform extends Sprite {
    constructor(xPos, yPos, xScale, yScale, attributes) {
        super()

        this.anchor.x = 0.5
        this.scale.x = xScale
        this.totalWidth = xScale
        this.position.x = xPos

        this.anchor.y = 0
        this.scale.y = yScale
        this.totalHeight = xScale
        this.position.y = yPos

        this.isPermeable = attributes.isPermeable?attributes.isPermeable:false
        this.slope = attributes.slope?attributes.slope:0

        if(this.slope === 1/3) {
            this.scale = {x: 1, y: 1}
        }

        this.tint = 0x888888
    }
    isPointAboveMe(point) {
        if(point.x >= this.position.x - this.totalWidth/2
        && point.x <= this.position.x + this.totalWidth/2
        && point.y <= this.getTopYAtX(point.x)) {
            return true
        } else {
            return false
        }
    }
    getTopYAtX(x) {
        var xOffsetFromCenter = x - this.position.x
        var yOffsetAtCenter = Math.abs(this.width/2 * this.slope)
        var yOffsetAtX = yOffsetAtCenter + xOffsetFromCenter * this.slope
        return Math.floor(this.position.y + yOffsetAtX)
    }
}

class Level extends Sprite {
    constructor() {
        super(Pixi.Texture.EMPTY)

        this.position.x = 0
        this.position.y = 0
        this.anchor.x = 0
        this.anchor.y = 0

        this.ground = this.addChild(new Platform(160, 160, 320, 20, {}))
        this.platforms = [new Platform(60, 140, 60, 4, {isPermeable: true}),
            new Platform(220, 114, 100, 4, {isPermeable: true}),
            new Platform(245, 80, 50, 4, {isPermeable: true})]
        this.platforms.push(new Platform(140, 95, 60, 4, {slope: 1/3, isPermeable: true}))
        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
        }
    }
}

class CollisionManager {
    constructor(hero, level) {
        this.hero = hero
        this.level = level
        this.hero.currentPlatform = this.level.ground
    }
    update() {
        var nearestLandingPlatform = this.level.ground
        var heroHeight = this.hero.feetOffset
        var maxAltitude = Infinity

        for(let i = 0; i < this.level.platforms.length; i ++) {
            var platYAtPlayerX = this.level.platforms[i].getTopYAtX(this.hero.position.x)
            if(platYAtPlayerX <= maxAltitude
                && this.level.platforms[i].isPointAboveMe(
                {x: this.hero.position.x, y: this.hero.position.y + heroHeight})) {
                maxAltitude = platYAtPlayerX
                nearestLandingPlatform = this.level.platforms[i]
            }
        }
        this.hero.currentPlatform = nearestLandingPlatform
    }
}
