var Pixi = require("pixi.js")

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class AnimatedSpriteExperiment extends Experiment {
    constructor() {
        super()

        this.addChild(new Hero())
    }
    get description() {
        return "Hello World!!"
    }
}

var HERO_TEXTURE = Pixi.Texture.fromImage(require("images/hero.running.png"))

class Hero extends Pixi.Sprite {
    constructor() {
        super(HERO_TEXTURE)
    }
}
