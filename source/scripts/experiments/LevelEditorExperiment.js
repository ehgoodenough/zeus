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

        this.leftPlatformPoint = {x: -1*this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x - this.totalWidth/2)}
        this.rightPlatformPoint = {x: this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x + this.totalWidth/2)}

        this.tint = 0x888888
        this.topLeftCornerCursor = this.addChild(new Cursor("TopLeft"))
        this.topRightCornerCursor = this.addChild(new Cursor("TopRight"))
    }
    representWithTexture() {

        var canvas = document.createElement("canvas")
        canvas.width = this.totalWidth
        canvas.height = this.thickness + Math.abs(this.getYOffsetAtX(this.position.x))*2
        var ctx = canvas.getContext("2d")

        ctx.fillStyle = "#fff"
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
    morph(activeCorner) {
        var staticCornerPoint

        if(activeCorner.cornerName === "TopLeft") {

        } else if(activeCorner.cornerName === "TopRight") {

        }
        this.representWithTexture()
    }
    update() {
        this.topLeftCornerCursor.update()
        this.topRightCornerCursor.update()
    }
}

class Cursor extends Sprite {
    constructor(corner) {
        super()
        this.scale.x = 4
        this.scale.y = 4
        this.cornerName = corner
        this.tint = 0x00AA00
        this.interactive = true
        this.anchor.y = 0
        this.preselected = false
        this.selected = false
        if(this.cornerName === "TopLeft") {
            this.anchor.x = 0
        } else if( this.cornerName === "TopRight") {
            this.anchor.x = 1
        }
        this.on("mousedown", function() {
            if(!this.preselected) {
                this.preselected = true
            } else {
                this.preselected = false
                this.selected = false
            }
        })
        this.on("mouseup", function() {
            if(this.preselected) {
                this.selected = true
            } else {
                this.deselect()
            }
        })
        this.on("mousemove", function(mouseData) {
            if(this.selected) {
                this.anchor = {x: 0.5, y: 0.5}
                this.position.x = mouseData.data.global.x - this.parent.position.x
                this.position.y = mouseData.data.global.y - this.parent.position.y
                this.parent.morph(this)
            }
        })
    }
    alignWithParentCorners() {
        if(this.cornerName === "TopLeft") {
            this.position = this.parent.leftPlatformPoint
            this.anchor.x = 0
        } else if( this.cornerName === "TopRight") {
            this.position = this.parent.rightPlatformPoint
            this.anchor.x = 1
        }
        this.anchor.y = 0
    }
    deselect() {
        this.selected = false
        this.alignWithParentCorners()
    }
    update() {
        if(!this.hasRunFirstUpdate) {
            this.alignWithParentCorners()
            this.hasRunFirstUpdate = true
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

        this.platforms = [new Platform(160, 160, 320, 20, {}),
            new Platform(60, 140, 60, 4, {isPermeable: true}),
            new Platform(220, 114, 100, 4, {isPermeable: true}),
            new Platform(245, 80, 50, 4, {isPermeable: true})]
        this.platforms.push(new Platform(140, 94, 60, 4, {slope: 1/3, isPermeable: true}))
        this.platforms.push(new Platform(240, 94, 60, 4, {slope: -1/9, isPermeable: true}))

        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            this.platforms[i].representWithTexture()
            //this.platforms[i].setYByRight(100)
        }
    }
    update() {
        for(let i = 0; i < this.platforms.length; i++) {
            this.platforms[i].update()
        }
    }
}
