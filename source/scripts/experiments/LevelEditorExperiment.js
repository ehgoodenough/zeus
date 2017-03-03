import * as Pixi from "pixi.js"
import Keyb from "keyb"

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class ActionExperiment extends Experiment {
    constructor() {
        super()

        var theLevel = this.addChild(new Level())

        this.children.reverse()
    }
    get description() {
        return "A platform creator and manager. "
             + "For creating platform base sprites and level design. "
    }
    update(delta) {
        this.children.forEach(function(child) {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
    }
}

class Pixel extends Sprite {
    constructor(xPos, yPos) {
        super()
        this.position.x = xPos
        this.position.y = yPos
        this.scale.x = 1
        this.scale.y = 1
        this.anchor.y = 0

        this.tint = 0x888888
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

        this.pixels = []

        this.tint = 0x888888
        this.graphics = this.addChild(new PIXI.Graphics())
    }
    representWithPixels() {
        for(let i = -1*this.totalWidth/2; i < this.totalWidth/2; i++) {
            var topOfPlatformAtX = this.getTopYAtX(i + this.position.x)
            for(let j = 0; j < this.thickness; j++) {
                if(j === 0 ||  j === this.thickness - 1
                    || i === -1*this.totalWidth/2 || i === this.totalWidth/2-1) {
                    this.pixels.push(this.addChild(new Pixel(i,
                        topOfPlatformAtX - this.position.y + j)))
                }
            }
        }
    }
    representWithLines() {
        this.graphics.beginFill(0x888888)

        var leftmostX = -1*this.totalWidth/2
        var rightmostX = this.totalWidth/2
        var thickness = this.thickness

        this.graphics.moveTo(leftmostX, this.getYOffsetAtX(leftmostX + this.position.x))
        this.graphics.lineTo(rightmostX, this.getYOffsetAtX(rightmostX + this.position.x))
        this.graphics.lineTo(rightmostX, this.getYOffsetAtX(rightmostX + this.position.x) + thickness)
        this.graphics.lineTo(leftmostX, this.getYOffsetAtX(leftmostX + this.position.x) + thickness)

        this.graphics.endFill()
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
        var yOffsetAtX = Math.floor(yOffsetAtCenter + xOffsetFromCenter * this.slope)
        return this.position.y + yOffsetAtX
    }
    getYOffsetAtX(x) {
        var xOffsetFromCenter = x - this.position.x
        var yOffsetAtCenter = Math.abs(this.totalWidth/2 * this.slope)
        var yOffsetAtX = Math.floor(yOffsetAtCenter + xOffsetFromCenter * this.slope)
        return yOffsetAtX
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
            new Platform(60, 140, 60, 4, {isPermeable: true}),
            new Platform(220, 114, 100, 4, {isPermeable: true}),
            new Platform(245, 80, 50, 4, {isPermeable: true})]
        this.platforms.push(new Platform(140, 95, 60, 4, {slope: 1/3, isPermeable: true}))
        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            this.platforms[i].representWithPixels()
        }
    }
}
