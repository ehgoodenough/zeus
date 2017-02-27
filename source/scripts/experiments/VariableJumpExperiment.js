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
        this.defaultGroundedYPosition = 140
        this.groundedYPosition = this.defaultGroundedYPosition
        this.lastGroundedYPosition = this.groundedYPosition

        //this.thePlatform = new Platform()
    }
    update(delta) {
        var applyGroundedFriction = true
        var applyAerialFriction = true
        var hasJumpedSinceGrounded = false

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
            if(!hasJumpedSinceGrounded && this.isGrounded()) {
                this.velocity.y += this.jumpForce
                this.lastGroundedYPosition = this.position.y
                hasJumpedSinceGrounded = true
            }
        }

        if(Keyb.isDown("S") || Keyb.isDown("<down>")) {
            if(this.isGrounded() && this.position.y < this.defaultGroundedYPosition) {
                this.position.y += 0.0001
                this.groundedYPosition = this.defaultGroundedYPosition
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
                && hasJumpedSinceGrounded)) {
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
            hasJumpedSinceGrounded = false
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
        this.scale.y = 20

        this.anchor.y = 0
        this.position.y = 160

        this.tint = 0x888888
    }
}

class Platform extends Sprite {
    constructor(xPos, yPos, xScale, yScale) {
        super()

        this.anchor.x = 0.5
        this.scale.x = xScale
        this.position.x = xPos

        this.anchor.y = 0
        this.scale.y = yScale
        this.position.y = yPos

        this.tint = 0x888888
    }
    isPointAboveMe(point) {
        if(point.x >= this.position.x - this.scale.x/2
        && point.x <= this.position.x + this.scale.x/2
        && point.y <= this.position.y) {
            return true
        } else {
            return false
        }
    }
}

class Level extends Sprite {
    constructor() {
        super(Pixi.Texture.EMPTY)

        this.position.x = 0
        this.position.y = 0
        this.anchor.x = 0
        this.anchor.y = 0

        this.ground = this.addChild(new Ground())
        this.platforms = [new Platform(60, 140, 60, 4),
            new Platform(220, 114, 100, 4),
            new Platform(245, 80, 50, 4)]
        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
        }
    }
}

class CollisionManager {
    constructor(hero, level) {
        this.hero = hero
        this.level = level
    }
    update() {
        var nearestLandingPlatform = this.level.ground
        var heroHeight = 20
        for(let i = 0; i < this.level.platforms.length; i ++) {
            var maxAltitude = 0
            if(180 - this.level.platforms[i].position.y > maxAltitude
                && this.level.platforms[i].isPointAboveMe(
                {x: this.hero.position.x, y: this.hero.position.y + heroHeight})) {
                maxAltitude = 180 - this.level.platforms[i].position.y
                nearestLandingPlatform = this.level.platforms[i]
            }
        }
        this.hero.groundedYPosition = nearestLandingPlatform.position.y - heroHeight
    }
}
