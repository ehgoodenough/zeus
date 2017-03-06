import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"

import pixelSrc from "images/pixel.png"

export default class Platform extends Sprite {
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
