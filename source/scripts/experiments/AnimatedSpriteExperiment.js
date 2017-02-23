var Pixi = require("pixi.js")

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

var BASE_TEXTURE = Pixi.BaseTexture.fromImage(require("images/hero.running.png"))
BASE_TEXTURE.scaleMode = Pixi.SCALE_MODES.NEAREST
var SPRITESHEET_DATA = require("images/hero.running.js")

export default class AnimatedSpriteExperiment extends Experiment {
    constructor() {
        super()

        var hero = new Hero()
        hero.position.x = 250
        hero.position.y = 90


        var sheet = new Pixi.Sprite(new Pixi.Texture(BASE_TEXTURE))
        sheet.position.x = 25
        sheet.position.y = 25

        this.addChild(hero)
        this.addChild(sheet)
    }
    get description() {
        return "The hero. A test of parsing and cutting a spritesheet, as "
             + "seen on the left. A test of animating a sprite, as seen "
             + "on the right."
    }
}

var spritesheet = new Pixi.Spritesheet(BASE_TEXTURE, SPRITESHEET_DATA)
spritesheet.parse(() => {})

class Hero extends Pixi.extras.AnimatedSprite {
    constructor() {
        super(Object.keys(spritesheet.textures).map((key) => {
            return spritesheet.textures[key]
        }))

        this.anchor.x = 0.5
        this.anchor.y = 0.5
    }
    update(delta) {
        super.update(delta.ms / 75)
    }
}
