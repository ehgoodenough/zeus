import * as Pixi from "pixi.js"
import Sprite from "scripts/models/Sprite.js"
import DevMode from "scripts/layers/DevMode.js"

var PERMEABLE_TOGGLE_TEXTURE = Pixi.Texture.fromImage(require("images/PermeableToggle.png"), false, Pixi.SCALE_MODES.NEAREST)

export default class PermeableToggle extends Sprite {
    constructor(subject) {
        super(PERMEABLE_TOGGLE_TEXTURE)
        this.subject = subject
        this.subject.addChild(this)
        this.position.x = 6
        this.position.y = 0

        this.scale.x = 1
        this.scale.y = 1

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.interactive = true
        this.selected = false

        this.toggle = this.subject.attributes.isPermeable
        if(!this.toggle) {
            this.tint = 0x222222
        }

        this.on("mousedown", function() {
            this.selected = true
        })
        this.on("mouseup", function() {
            if(this.selected) {
                if(this.toggle) {
                    this.subject.attributes.isPermeable = false
                    this.tint = 0x222222
                    this.toggle = false
                } else {
                    this.subject.attributes.isPermeable = true
                    this.tint = 0xFFFFFF
                    this.toggle = true
                }
                this.origin.stashLevel()
            }
        })
    }
}
