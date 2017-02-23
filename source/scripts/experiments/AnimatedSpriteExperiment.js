var Pixi = require("pixi.js")

import Experiment from "scripts/experiments/Experiment.js"
import Sprite from "scripts/models/Sprite.js"

export default class AnimatedSpriteExperiment extends Experiment {
    constructor() {
        super()
    }
    get description() {
        return "Hello World!!"
    }
}
