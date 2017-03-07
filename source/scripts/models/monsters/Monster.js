import * as Pixi from "pixi.js"

import Sprite from "scripts/models/Sprite.js"

var WOLF_TEXTURE = Pixi.Texture.fromImage(require("images/wolf.png"), false, Pixi.SCALE_MODES.NEAREST)
var FLOOR = 162
var MIN_VELOCITY = 0.01

export default class Monster extends Sprite {
    constructor() {
        super(WOLF_TEXTURE)

        this.position.x = 240 * 2
        this.position.y = FLOOR

        this.anchor.x = 0.5
        this.anchor.y = 1

        this.state = "CHARGE"

        this.forwardAcceleration = 1
        this.backwardAcceleration = 0.75
        this.strikeSpeed = {x: 7, y: 6}
        this.prowlDistance = 100
        this.gravity = 0.65
        this.friction = 0.8
        this.maxVelocity = 2

        this.velocity = new Pixi.Point()
    }
    update(delta) {
        // Get the distance between the wolf and the hero.
        this.distance = this.origin.hero.position.x - this.position.x

        // Point the wolf towards the hero.
        this.direction = this.distance < 0 ? -1 : +1

        // Do the things!!
        if(this.state == "THINK") {
            this.think(delta)
        } else if(this.state === "PROWL") {
            this.prowl(delta)
        } else if(this.state === "STRIKE") {
            this.strike(delta)
        } else if(this.state === "CHARGE") {
            this.charge(delta)
        }

        // Collision with the floor.
        if(this.position.y + this.velocity.y > FLOOR) {
            this.velocity.y = FLOOR - this.position.y
        }

        // Translate via velocity.
        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        // Apply gravity to vertical velocity.
        this.velocity.y += this.gravity * delta.f

        // Apply friction to horizontal velocity.
        if(this.isGrounded) {
            this.velocity.x *= this.friction
        }

        // Round any miniscule velocities to zero.
        if(this.velocity.x < 0 && this.velocity.x > -MIN_VELOCITY
        || this.velocity.x > 0 && this.velocity.x < +MIN_VELOCITY) {
            this.velocity.x = 0
        }
    }
    prowl(delta) {
        // Move the wolf so it maintains it's distance
        // from the hero, looking for an opportunity to strike.
        if(Math.abs(this.distance) - 10 > this.prowlDistance) {
            // If the wolf is too far from the hero, move it forwards.
            this.velocity.x += this.forwardAcceleration * this.direction * delta.f
        } else if (Math.abs(this.distance) + 10 < this.prowlDistance) {
            // If the wolf is too close to the hero, move it backwards.
            // Moving backwards should be slightly slower than moving forwards.
            this.velocity.x -= this.backwardAcceleration * this.direction * delta.f
        }

        // Cap the horizontal velocity.
        if(this.velocity.x > this.maxVelocity) {
            this.velocity.x = this.maxVelocity
        } if(this.velocity.x < -1 * this.maxVelocity) {
            this.velocity.x = -1 * this.maxVelocity
        }

        // If the wolf is close enough to the hero, and
        // the wolf has determinded the hero is open for
        // an attack, then strike out at the hero.
        if(Math.abs(this.distance) - 10 <= this.prowlDistance) {
            if(this.origin.hero.isGrounded
            && this.origin.hero.direction == this.direction) {
                this.velocity.x = this.strikeSpeed.x * this.direction
                this.velocity.y = -1 * this.strikeSpeed.y
                this.state = "STRIKE"
            }
        }
    }
    strike(delta) {
        if(this.isGrounded && this.velocity.x == 0) {
            this.state = "CHARGE" // Math.random() < 0.25 ? "CHARGE" : "PROWL"
        }

        // ADD THE HURTBOX/HITBOX HERO/MONSTER CHECKS
    }
    charge(delta) {
        // If the wolf is too far from the hero, move it forwards.
        this.velocity.x += this.forwardAcceleration * this.direction * delta.f

        // If the wolf is close enough to the
        // hero, then strike out at the hero.
        if(Math.abs(this.distance) <= this.prowlDistance) {
            this.velocity.x = this.strikeSpeed.x * this.direction
            this.velocity.y = -1 * this.strikeSpeed.y
            this.state = "STRIKE"

            // THIS CODE IS DUPLICATED!! I WISH THIS COULD
            // BE RUN BY THE STRIKE STATE, NOT IN THE STATE
            // THAT PRECEDED THE STRIKE STATE. :<
        }
    }
    get isGrounded() {
        return this.position.y == FLOOR
    }
}

// sometimes, the wolf should just randomly charge in.

// edit velocity, not position.
// strike when the player has just attacked but missed.
// put the strike on a timer, with tell from an animation.
// put the cooldown after strike back into prowl on a timer, not on velocity.
// before performing a charge, there be some kind of a tell, maybe a howl.
// act differently if there are more wolves around them?
// death animation
