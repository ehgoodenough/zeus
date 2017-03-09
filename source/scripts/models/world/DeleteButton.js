import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import DevMode from "scripts/layers/DevMode.js"

var DELETE_BUTTON_TEXTURE = Pixi.Texture.fromImage(require("images/DeleteButton.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class DeleteButton extends Sprite {
    constructor(subject) {
        super(DELETE_BUTTON_TEXTURE)
        this.subject = subject
        this.subject.addChild(this)
        this.position.x = 0
        this.position.y = 0

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
            if(this.selected) {
                for(let i = 0; i < this.subject.controlPoints.length; i++) {
                    this.subject.controlPoints[i].interactive = false
                    this.subject.parent.trash.push(this.subject.controlPoints[i])
                }
                this.interactive = false
                this.subject.parent.trash.push(this)
            }
        })

        this.visible = DevMode.isActive
    }
}
