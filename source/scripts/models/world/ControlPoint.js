import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"

import pixelSrc from "images/pixel.png"

var CONTROL_POINT_TEXTURE = Pixi.Texture.fromImage(require("images/ControlPoint.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class ControlPoint extends Sprite {
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
