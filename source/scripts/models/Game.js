import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Sprite from "scripts/models/Sprite.js"

var pixelSrc = require("images/pixel.png")

export default class Game extends Pixi.Container {
    constructor() {
        super()

        // Instantiate the renderer.
        Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
        this.renderer = Pixi.autoDetectRenderer(320, 180)
        this.renderer.backgroundColor = 0x444444

        // Instantiate the entities.
        var theHero = this.addChild(new Hero())
        var theLevel = this.addChild(new Level())
        this.collisionManager = new CollisionManager(theHero, theLevel)
    }
    update(delta) {
        this.children.forEach(function(child) {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })

        if(this.collisionManager.update instanceof Function) {
            this.collisionManager.update()
        }
    }
    render() {
        this.renderer.render(this)
    }
}

class Platform extends Sprite {
    constructor(xPos, yPos, width, thickness, attributes) {
        super(Pixi.Texture.EMPTY)

        this.anchor.x = 0.5
        this.scale.x = 1
        this.totalWidth = width
        this.position.x = xPos

        this.anchor.y = 0
        this.scale.y = 1
        this.thickness = thickness
        this.position.y = yPos

        this.isPermeable = attributes.isPermeable?attributes.isPermeable:false
        this.slope = attributes.slope?attributes.slope:0

        this.leftPlatformPoint = {x: -1*this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x - this.totalWidth/2)}
        this.rightPlatformPoint = {x: this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x + this.totalWidth/2)}

        this.tint = 0x888888
    }
    generateNewAntiAliasedTexture() {

        var canvas = document.createElement("canvas")
        canvas.width = this.totalWidth
        canvas.height = this.thickness + Math.abs(this.getYOffsetAtX(this.position.x))*2
        var ctx = canvas.getContext("2d")

        //black background for debugging
        // ctx.fillStyle = "#000"
        // ctx.beginPath()
        // ctx.moveTo(0, 0)
        // ctx.lineTo(canvas.width, 0)
        // ctx.lineTo(canvas.width, canvas.height)
        // ctx.lineTo(0,  canvas.height)
        // ctx.closePath()
        // ctx.fill()

        ctx.fillStyle = "#fff"
        ctx.lineWidth = 2
        ctx.beginPath()
        if(this.slope > 0) {
            ctx.moveTo(0, 0)
            ctx.lineTo(canvas.width, canvas.height - this.thickness)
            ctx.lineTo(canvas.width, canvas.height)
            ctx.lineTo(0,  this.thickness)
        } else {
            ctx.moveTo(0, canvas.height - this.thickness)
            ctx.lineTo(canvas.width, 0)
            ctx.lineTo(canvas.width, this.thickness)
            ctx.lineTo(0,  canvas.height)
            ctx.closePath()
        }
        ctx.fill()

        this.texture = PIXI.Texture.fromCanvas(canvas)
    }

    generateNewTexture() {

        var pixel = new Image()
        pixel.src = pixelSrc
        var canvas = document.createElement("canvas")
        canvas.width = this.totalWidth
        canvas.height = this.thickness + Math.abs(this.getYOffsetAtX(this.position.x))*2
        var ctx = canvas.getContext("2d")
        for(let i = 0; i < canvas.width; i++) {
            for(let j = 0; j < this.thickness; j++) {
                ctx.drawImage(pixel, i, this.getYOffsetAtX(this.position.x
                    - this.totalWidth/2 + i) + j)
            }
        }

        this.texture = PIXI.Texture.fromCanvas(canvas)
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
        var yOffsetAtCenter = Math.abs(this.totalWidth/2 * this.slope)
        var yOffsetAtX = yOffsetAtCenter + xOffsetFromCenter * this.slope
        return this.position.y + yOffsetAtX
    }
    getYOffsetAtX(x) {
        var xOffsetFromCenter = x - this.position.x
        var yOffsetAtCenter = Math.abs(this.totalWidth/2 * this.slope)
        var yOffsetAtX = yOffsetAtCenter + xOffsetFromCenter * this.slope
        return yOffsetAtX
    }
    setYByLeft(newY) {
        this.position.y = newY - this.leftPlatformPoint.y
    }
    setYByRight(newY) {
        this.position.y = newY - this.rightPlatformPoint.y
    }
    getCornerPoints() {
        return [this.leftPlatformPoint, this.rightPlatformPoint,
            this.leftPlatformPoint + this.thickness, this.rightPlatformPoint + this.thickness]
    }
    recreate(leftControlPoint, rightControlPoint) {
        this.position.y = leftControlPoint.y < rightControlPoint.y?
            leftControlPoint.y:rightControlPoint.y
        this.totalWidth = rightControlPoint.x - leftControlPoint.x
        this.position.x = rightControlPoint.x - this.totalWidth/2
        this.slope = (rightControlPoint.y - leftControlPoint.y)/
            (rightControlPoint.x - leftControlPoint.x)
        this.generateNewTexture()
        this.leftPlatformPoint = {x: -1*this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x - this.totalWidth/2)}
        this.rightPlatformPoint = {x: this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x + this.totalWidth/2)}
    }
}


var CONTROL_POINT_TEXTURE = Pixi.Texture.fromImage(require("images/ControlPoint.png"), false, Pixi.SCALE_MODES.NEAREST)
class ControlPoint extends Sprite {
    constructor(subject, side) {
        super(CONTROL_POINT_TEXTURE)
        this.subject = subject
        this.side = side
        this.scale.x = 1
        this.scale.y = 1
        this.interactive = true
        this.anchor.y = 0
        this.preselected = false
        this.selected = false
        if(this.side === "Left") {
            this.anchor.x = 0
            this.subject.leftControlPoint = this
            this.position = this.subject.leftPlatformPoint
        } else if( this.side === "Right") {
            this.anchor.x = 1
            this.subject.rightControlPoint = this
            this.position = this.subject.rightPlatformPoint
        }
        this.on("mousedown", function() {
            // if(!this.preselected) {
            //     this.preselected = true
            // } else {
            //     this.preselected = false
            //     this.selected = false
            // }
            this.selected = true

        })
        this.on("mouseup", function() {
            // if(this.preselected) {
            //     this.selected = true
            //     this.anchor = {x: 0.5, y: 0.5}
            // } else {
            //     this.deselect()
            // }
            this.selected = false
            this.deselect()
            //}
        })
        this.on("mousemove", function(mouseData) {
            if(this.selected) {
                this.anchor = {x: 0.5, y: 0.5}

                this.position.x = Math.floor(mouseData.data.global.x)
                this.position.y = Math.floor(mouseData.data.global.y)
                var leftCreationPoint
                var rightCreationPoint
                if(this.side === "Left") {
                    leftCreationPoint = {x: this.subject.leftControlPoint.x
                        - this.width/2,
                        y: this.subject.leftControlPoint.y - this.height/2}
                    rightCreationPoint = {x: this.subject.rightControlPoint.x,
                        y: this.subject.rightControlPoint.y}
                } else {
                    var leftCreationPoint = {x: this.subject.leftControlPoint.x,
                        y: this.subject.leftControlPoint.y}
                    var rightCreationPoint = {x: this.subject.rightControlPoint.x
                        + this.width/2,
                        y: this.subject.rightControlPoint.y - this.height/2}
                }
                this.subject.recreate(leftCreationPoint, rightCreationPoint)
            }
        })
        this.alignWithSubject()
    }
    alignWithSubject() {
        if(this.side === "Left") {
            this.position = {x: this.subject.leftPlatformPoint.x + this.subject.position.x,
                y: this.subject.leftPlatformPoint.y + this.subject.position.y}
            this.anchor.x = 0
        } else if( this.side === "Right") {
            this.position = {x: this.subject.rightPlatformPoint.x + this.subject.position.x,
                y: this.subject.rightPlatformPoint.y + this.subject.position.y}
            this.anchor.x = 1
        }
        this.anchor.y = 0
    }
    deselect() {
        this.selected = false
        this.alignWithSubject()
    }
}

class Level extends Sprite {
    constructor() {
        super(Pixi.Texture.EMPTY)

        this.position.x = 0
        this.position.y = 0
        this.anchor.x = 0
        this.anchor.y = 0

        this.platforms = [new Platform(160, 160, 320, 20, {}),
            new Platform(60, 140, 60, 8, {isPermeable: true}),
            new Platform(220, 114, 100, 8, {isPermeable: true}),
            new Platform(245, 80, 50, 8, {isPermeable: true})]
        this.platforms.push(new Platform(140, 94, 60, 8, {slope: 1/3, isPermeable: true}))
        this.platforms.push(new Platform(240, 94, 60, 8, {slope: -1/6, isPermeable: true}))

        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            this.platforms[i].generateNewTexture()
            this.addChild(new ControlPoint(this.platforms[i], "Left"))
            this.addChild(new ControlPoint(this.platforms[i], "Right"))
        }
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

class CollisionManager {
    constructor(hero, level) {
        this.hero = hero
        this.level = level
        this.hero.currentPlatform = this.level.platforms[0]
    }
    update() {
        var nearestLandingPlatform = this.level.platforms[0]
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
