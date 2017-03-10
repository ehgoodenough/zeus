import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"

import pixelSrc from "images/pixel.png"

export default class Platform extends Sprite {
    constructor(protoPlatform) {
        super(Pixi.Texture.EMPTY)
        var pointPairs = protoPlatform.pointPairs
        var attributes = protoPlatform.attributes

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.scale.x = 1
        this.scale.y = 1

        this.attributes = attributes?attributes:{}

        this.pointPairs = pointPairs
        this.numOfSegments = pointPairs.length - 1

        this.controlPoints = []

        this.setCenterAndDimensions()
        this.generateNewTexture()
        this.tint = 0x888888
    }
    isPointAboveMe(point) {
        if(point.x >= this.position.x - this.spriteWidth/2
        && point.x <= this.position.x + this.spriteWidth/2
        && point.y <= this.getTopYAtX(point.x)) {
            return true
        } else {
            return false
        }
    }
    getTopYAtX(x) {
        var leftPoint
        var rightPoint
        var currentSegment = 0
        var found = false
        if(x < this.pointPairs[currentSegment].top.x) {
            found = true
            leftPoint = this.pointPairs[0].top
            rightPoint = this.pointPairs[1].top
            var slope = (rightPoint.y - leftPoint.y)/(rightPoint.x - leftPoint.x)
            var topOffset = leftPoint.y + (leftPoint.x - x) * slope
            return topOffset
        } else if (x > this.pointPairs[this.pointPairs.length-1].top.x) {
            found = true
            leftPoint = this.pointPairs[this.pointPairs.length-2].top
            rightPoint = this.pointPairs[this.pointPairs.length-1].top
            var slope = (rightPoint.y - leftPoint.y)/(rightPoint.x - leftPoint.x)
            var topOffset = rightPoint.y + (rightPoint.x - x) * slope
            return topOffset
        } else {
            while(currentSegment < this.pointPairs.length - 1 && !found) {
                leftPoint = this.pointPairs[currentSegment].top
                rightPoint = this.pointPairs[currentSegment+1].top
                if(x >= leftPoint.x && x <= rightPoint.x) {
                    found = true
                } else {
                    currentSegment += 1
                }
            }
            var slope = (rightPoint.y - leftPoint.y)/(rightPoint.x - leftPoint.x)
            var topOffset = leftPoint.y + (x - leftPoint.x) * slope
            return topOffset
        }
    }
    getBottomYAtX(x) {
        var leftPoint
        var rightPoint
        var currentSegment = 0
        var found = false
        while(currentSegment < this.pointPairs.length - 1 && !found) {
            leftPoint = this.pointPairs[currentSegment].bottom
            rightPoint = this.pointPairs[currentSegment+1].bottom
            if(x >= leftPoint.x && x <= rightPoint.x) {
                found = true
            } else {
                currentSegment += 1
            }
        }
        var slope = (rightPoint.y - leftPoint.y)/(rightPoint.x - leftPoint.x)
        var topOffset = leftPoint.y + (x - leftPoint.x) * slope
        if(found) {
            return topOffset
        } else {
            return null
        }
    }
    generateNewTexture() {
        var pixel = new Image()
        pixel.src = pixelSrc
        var canvas = document.createElement("canvas")
        var spriteBoundaries = this.getSpriteBoundaries()
        canvas.width = spriteBoundaries.maxX - spriteBoundaries.minX
        canvas.height = spriteBoundaries.maxY - spriteBoundaries.minY
        var ctx = canvas.getContext("2d")
        for(let i = 0; i < canvas.width; i++) {
            //draw top
            var topYPosition = Math.round(this.getTopYAtX(this.position.x + i
                -canvas.width/2) - this.position.y + canvas.height/2)
            var bottomYPosition = Math.round(this.getBottomYAtX(this.position.x + i
                -canvas.width/2) - this.position.y + canvas.height/2)
            for(let j = topYPosition; j < bottomYPosition; j++) {
                ctx.drawImage(pixel, i, j)
            }
        }
        this.texture = PIXI.Texture.fromCanvas(canvas)
    }
    recreate() {
        this.setCenterAndDimensions()
        this.generateNewTexture()
    }
    setCenterAndDimensions() {
        var spriteBoundaries = this.getSpriteBoundaries()
        var minX = spriteBoundaries.minX
        var maxX = spriteBoundaries.maxX
        var minY = spriteBoundaries.minY
        var maxY = spriteBoundaries.maxY
        var centerX = maxX - (maxX - minX) / 2
        var centerY = maxY - (maxY - minY) / 2
        this.position.x = centerX
        this.position.y = centerY
        this.spriteWidth = maxX - minX
        this.spriteHeight = maxY - minY
    }
    getSpriteBoundaries() {
        var minX = this.pointPairs[0].top.x
        var maxX = this.pointPairs[this.pointPairs.length-1].top.x
        var minY = this.pointPairs[0].top.y
        var maxY = this.pointPairs[0].bottom.y
        for(let i = 1; i < this.pointPairs.length; i++) {
            if(this.pointPairs[i].top.y < minY) {
                minY = this.pointPairs[i].top.y
            }
            if(this.pointPairs[i].bottom.y > maxY) {
                maxY = this.pointPairs[i].bottom.y
            }
        }
        return {minX: minX, maxX: maxX, minY: minY, maxY: maxY}
    }
    getRelativePointPairs() {
        var relativePointPairs = []
        for(let i = 0; i < this.pointPairs.length; i++) {
            var relativeTop = {x: this.pointPairs[i].top.x - this.position.x,
                y: this.pointPairs[i].top.y - this.position.y}
            var relativeBottom = {x: this.pointPairs[i].bottom.x - this.position.x,
                y: this.pointPairs[i].bottom.y - this.position.y}
            relativePointPairs.push({top: relativeTop, bottom: relativeBottom})
        }
        return relativePointPairs
    }
    toJSON() {
        return {pointPairs: this.pointPairs, attributes: this.attributes}
    }
}
