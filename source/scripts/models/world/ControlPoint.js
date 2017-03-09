import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import DevMode from "scripts/layers/DevMode.js"

var CONTROL_POINT_TEXTURE = Pixi.Texture.fromImage(require("images/ControlPoint.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class ControlPoint extends Sprite {
    constructor(xPos, yPos, subject, index, side) {
        super(CONTROL_POINT_TEXTURE)
        this.position.x = xPos
        this.position.y = yPos
        this.subject = subject
        this.index = index
        this.side = side

        this.scale.x = 1
        this.scale.y = 1

        this.xOffset = 0
        this.yOffset = 0
        this.setAnchors()

        this.interactive = true
        this.selected = false

        this.on("mousedown", function(mouseData) {
            this.setAnchors()
            this.selected = true
            this.anchor = {x: 0.5, y: 0.5}
            this.moveToMousePosition(mouseData)
        })
        this.on("mouseup", function() {
            this.selected = false
            this.setAnchors()
            this.position.x += this.xOffset
            this.position.y += this.yOffset
        })
        this.on("mousemove", function(mouseData) {
            if(this.selected) {
                this.moveToMousePosition(mouseData)
            }
        })
    }
    setAnchors() {
        if(this.side == "top") {
            this.anchor.y = 0
            this.yOffset = -1 * this.height/2
        } else if(this.side == "bottom") {
            this.anchor.y = 1
            this.yOffset = this.height/2
        }

        if(this.index == 0) {
            this.anchor.x = 0
            this.end = "left"
            this.xOffset = -1 * this.width/2
        } else if(this.index == this.subject.pointPairs.length-1) {
            this.anchor.x = 1
            this.end = "right"
            this.xOffset = this.width/2
        }
    }
    moveToMousePosition(mouseData) {
        this.position.x = Math.round(mouseData.data.global.x
            - this.origin.position.x)
        this.position.y = Math.round(mouseData.data.global.y
            - this.origin.position.y)
        this.partner.position.x = this.position.x + this.xOffset

        this.subject.pointPairs[this.index][this.side].y = this.position.y + this.yOffset
        this.subject.pointPairs[this.index]["top"].x = this.position.x + this.xOffset
        this.subject.pointPairs[this.index]["bottom"].x = this.position.x + this.xOffset
        this.subject.recreate()
        this.origin.stashLevel()
    }
}
