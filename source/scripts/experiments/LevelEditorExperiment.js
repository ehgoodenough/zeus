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
    generateNewTexture() {

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
    recreate(leftControlPoint, rightControlPoint) {
        this.position.y = leftControlPoint.y < rightControlPoint.y?
            leftControlPoint.y:rightControlPoint.y
        this.totalWidth = rightControlPoint.x - leftControlPoint.x
        this.position.x = rightControlPoint.x - this.width/2
        this.slope = (rightControlPoint.y - leftControlPoint.y)/
            (rightControlPoint.x - leftControlPoint.x)
        this.generateNewTexture()
        this.leftPlatformPoint = {x: -1*this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x - this.totalWidth/2)}
        this.rightPlatformPoint = {x: this.totalWidth/2,
            y: this.getYOffsetAtX(this.position.x + this.totalWidth/2)}
    }
}

class ControlPoint extends Sprite {
    constructor(subject, side) {
        super()
        this.subject = subject
        this.side = side
        this.scale.x = 2
        this.scale.y = 2
        this.tint = 0x00AA00
        this.interactive = true
        this.anchor.y = 0
        this.preselected = false
        this.selected = false
        if(this.side === "Left") {
            this.anchor.x = 0
            this.subject.leftControlPoint = this
        } else if( this.side === "Right") {
            this.anchor.x = 1
            this.subject.rightControlPoint = this
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
                this.anchor = {x: 0.5, y: 0.5}
            } else {
                this.deselect()
            }
        })
        this.on("mousemove", function(mouseData) {
            if(this.selected) {
                this.position.x = Math.floor(mouseData.data.global.x)
                this.position.y = Math.floor(mouseData.data.global.y)
                var leftCreationPoint = {x: this.subject.leftControlPoint.x
                    - this.scale.x/2, y: this.subject.leftControlPoint.y -
                    this.scale.y/2}
                var rightCreationPoint = {x: this.subject.rightControlPoint.x
                    + this.scale.x/2, y: this.subject.rightControlPoint.y -
                    this.scale.y/2}
                this.subject.recreate(leftCreationPoint, rightCreationPoint)
                //console.log(this.subject.leftPlatformPoint.x)
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
            new Platform(60, 140, 60, 4, {isPermeable: true}),
            new Platform(220, 114, 100, 4, {isPermeable: true}),
            new Platform(245, 80, 50, 4, {isPermeable: true})]
        this.platforms.push(new Platform(140, 94, 60, 4, {slope: 1/3, isPermeable: true}))
        this.platforms.push(new Platform(240, 94, 60, 4, {slope: -1/9, isPermeable: true}))

        for(let i = 0; i < this.platforms.length; i++) {
            this.addChild(this.platforms[i])
            this.platforms[i].generateNewTexture()
            this.addChild(new ControlPoint(this.platforms[i], "Left"))
            this.addChild(new ControlPoint(this.platforms[i], "Right"))
            //this.platforms[i].setYByRight(100)
        }
    }
}
