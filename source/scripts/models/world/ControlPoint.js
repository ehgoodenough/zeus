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

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.interactive = true
        this.selected = false

        this.on("mousedown", function() {
            this.selected = true
        })
        this.on("mouseup", function() {
            this.selected = false
        })
        this.on("mousemove", function(mouseData) {
            if(this.selected) {
                this.anchor = {x: 0.5, y: 0.5}

                this.position.x = Math.floor(mouseData.data.global.x) - this.origin.position.x
                this.position.y = Math.floor(mouseData.data.global.y) - this.origin.position.y
                this.partner.position.x = this.position.x

                this.subject.pointPairs[index][side].y = this.position.y
                this.subject.pointPairs[index]["top"].x = this.position.x
                this.subject.pointPairs[index]["bottom"].x = this.position.x
                this.subject.recreate()
                this.origin.stashLevel()
            }
        })
    }
}
